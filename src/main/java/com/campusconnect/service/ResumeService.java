package com.campusconnect.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private static final String UPLOAD_DIR = "uploads/resumes/";
    private static final Path UPLOAD_PATH = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
    private final Tika tika = new Tika();

    private static final Set<String> STOPWORDS = Set.of(
            "the", "and", "for", "are", "but", "not", "you", "all", "any", "can",
            "had", "her", "was", "one", "our", "out", "day", "get", "has", "him",
            "his", "how", "its", "new", "now", "old", "see", "two", "way", "who",
            "boy", "did", "man", "men", "put", "say", "she", "too", "use", "with",
            "have", "this", "that", "from", "they", "will", "would", "there",
            "their", "what", "about", "which", "when", "make", "like", "time",
            "just", "know", "take", "into", "your", "some", "them", "than", "then",
            "only", "come", "work", "such", "also", "back", "after", "well", "even",
            "want", "because", "these", "most", "is", "a", "as", "at", "be", "by",
            "he", "in", "it", "of", "on", "or", "an", "to", "we", "so", "if", "do",
            "no", "up", "my", "me"
    );

    // ---- File handling ----

    public String saveResume(MultipartFile file, Long studentId) throws IOException {
        if (file.getContentType() == null || !file.getContentType().equals("application/pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File too large. Max 5 MB.");
        }

        Files.createDirectories(UPLOAD_PATH);

        String filename = "student_" + studentId + "_" + System.currentTimeMillis() + ".pdf";
        Path filePath = UPLOAD_PATH.resolve(filename);
        Files.write(filePath, file.getBytes());

        return filename;
    }

    public String extractText(String storedName) throws IOException, TikaException {
        Path filePath = resolveResumePath(storedName);
        if (filePath == null || !Files.exists(filePath)) {
            throw new RuntimeException("Resume file not found on disk");
        }
        return tika.parseToString(filePath.toFile());
    }

    public Path resolveResumePath(String storedName) {
        if (storedName == null || storedName.isEmpty()) return null;

        String clean = storedName.replace("\\", "/");
        int slash = clean.lastIndexOf('/');
        if (slash >= 0) clean = clean.substring(slash + 1);

        Path filePath = UPLOAD_PATH.resolve(clean).normalize();
        if (!filePath.startsWith(UPLOAD_PATH)) return null;
        return filePath;
    }

    // ---- ATS scoring (unchanged) ----

    public Map<String, Object> computeAtsScore(String resumeText, String jobDescription) {
        List<String> resumeTokens = tokenize(resumeText);
        List<String> jobTokens = tokenize(jobDescription);

        if (resumeTokens.isEmpty() || jobTokens.isEmpty()) return emptyScore();

        double similarityScore = tfIdfCosineSimilarity(resumeTokens, jobTokens);

        Set<String> resumeKeywords = new HashSet<>(resumeTokens);
        Set<String> jobKeywords = new HashSet<>(jobTokens);

        Set<String> matched = new TreeSet<>(resumeKeywords);
        matched.retainAll(jobKeywords);

        Set<String> missing = new TreeSet<>(jobKeywords);
        missing.removeAll(resumeKeywords);

        double overlapScore = jobKeywords.isEmpty()
                ? 0.0
                : (matched.size() * 100.0) / jobKeywords.size();

        double finalScore = similarityScore * 0.6 + overlapScore * 0.4;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", round(finalScore));
        result.put("similarityScore", round(similarityScore));
        result.put("keywordOverlapScore", round(overlapScore));
        result.put("matchedKeywords", matched.stream().limit(30).collect(Collectors.toList()));
        result.put("missingKeywords", missing.stream().limit(30).collect(Collectors.toList()));
        result.put("totalJobKeywords", jobKeywords.size());
        result.put("totalMatched", matched.size());
        return result;
    }

    private List<String> tokenize(String text) {
        if (text == null) return List.of();
        return Pattern.compile("\\W+")
                .splitAsStream(text.toLowerCase())
                .filter(w -> w.length() > 2 && !STOPWORDS.contains(w))
                .collect(Collectors.toList());
    }

    private double tfIdfCosineSimilarity(List<String> docA, List<String> docB) {
        Map<String, Integer> tfA = countFrequencies(docA);
        Map<String, Integer> tfB = countFrequencies(docB);

        Set<String> vocab = new HashSet<>();
        vocab.addAll(tfA.keySet());
        vocab.addAll(tfB.keySet());

        Map<String, Double> idf = new HashMap<>();
        for (String term : vocab) {
            int df = 0;
            if (tfA.containsKey(term)) df++;
            if (tfB.containsKey(term)) df++;
            idf.put(term, Math.log(2.0 / (1.0 + df)) + 1.0);
        }

        double[] vecA = new double[vocab.size()];
        double[] vecB = new double[vocab.size()];
        int i = 0;
        int totalA = docA.size();
        int totalB = docB.size();

        for (String term : vocab) {
            double tfAVal = tfA.getOrDefault(term, 0) / (double) totalA;
            double tfBVal = tfB.getOrDefault(term, 0) / (double) totalB;
            vecA[i] = tfAVal * idf.get(term);
            vecB[i] = tfBVal * idf.get(term);
            i++;
        }

        double dot = 0, magA = 0, magB = 0;
        for (int j = 0; j < vocab.size(); j++) {
            dot += vecA[j] * vecB[j];
            magA += vecA[j] * vecA[j];
            magB += vecB[j] * vecB[j];
        }
        if (magA == 0 || magB == 0) return 0;
        return (dot / (Math.sqrt(magA) * Math.sqrt(magB))) * 100.0;
    }

    private Map<String, Integer> countFrequencies(List<String> tokens) {
        Map<String, Integer> freq = new HashMap<>();
        for (String t : tokens) freq.merge(t, 1, Integer::sum);
        return freq;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private Map<String, Object> emptyScore() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", 0.0);
        result.put("similarityScore", 0.0);
        result.put("keywordOverlapScore", 0.0);
        result.put("matchedKeywords", List.of());
        result.put("missingKeywords", List.of());
        result.put("totalJobKeywords", 0);
        result.put("totalMatched", 0);
        return result;
    }
}