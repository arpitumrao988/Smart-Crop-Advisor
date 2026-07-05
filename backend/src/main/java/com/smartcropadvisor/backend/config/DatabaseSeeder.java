package com.smartcropadvisor.backend.config;

import com.smartcropadvisor.backend.model.DiseaseInfo;
import com.smartcropadvisor.backend.repository.DiseaseInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);
    private final DiseaseInfoRepository diseaseInfoRepository;

    public DatabaseSeeder(DiseaseInfoRepository diseaseInfoRepository) {
        this.diseaseInfoRepository = diseaseInfoRepository;
    }

    @Override
    public void run(String... args) {
        if (diseaseInfoRepository.count() == 0) {
            log.info("Database disease_info table is empty. Seeding reference data...");

            List<DiseaseInfo> seeds = List.of(
                    // ── RICE DISEASES ────────────────────────────────
                    DiseaseInfo.builder()
                            .cropName("Rice")
                            .diseaseName("Bacterial Leaf Blight")
                            .symptoms("Water-soaked stripes starting from leaf tips and margins, which enlarge and turn yellow/light brown. In young seedlings, leaves roll up, wilt, and dry out (known as kresek stage). Sticky yellow bacterial ooze may appear on leaves in high humidity.")
                            .treatment("Avoid excessive nitrogen fertilization as it promotes vegetative growth that is highly vulnerable. Drain the fields temporarily if severe infection is observed. Apply copper-based bactericides (e.g., Copper Oxychloride) at 2.5g/L under expert consultation.")
                            .prevention("Use disease-resistant rice cultivars. Ensure proper plant spacing for air circulation. Destroy infected crop residues and weeds around the bunds after harvest. Avoid flooding nursery beds.")
                            .build(),
                    DiseaseInfo.builder()
                            .cropName("Rice")
                            .diseaseName("Blast")
                            .symptoms("Spindle-shaped or diamond-shaped lesions on leaves with gray/white centers and reddish-brown borders. In later stages, lesions can form on the neck of the panicle (neck blast), causing it to break and grains to remain empty.")
                            .treatment("Apply systemic fungicides such as Tricyclazole (e.g., 0.6g/L) or Isoprothiolane immediately upon first symptom detection. Avoid late-season nitrogen applications.")
                            .prevention("Select certified disease-free seeds or treat seeds with fungicides before sowing. Maintain balanced NPK nutrition. Avoid water stress (maintain continuous shallow flooding in fields).")
                            .build(),

                    // ── WHEAT DISEASES ───────────────────────────────
                    DiseaseInfo.builder()
                            .cropName("Wheat")
                            .diseaseName("Leaf Rust")
                            .symptoms("Small, oval, orange-yellow to reddish-brown powdery pustules (uredinia) scattered randomly on the upper leaf surface. Under severe infestation, leaves turn yellow and die prematurely, shrinking grain size.")
                            .treatment("Apply chemical fungicides such as Propiconazole (25% EC) or Tebuconazole at recommended doses. Spray at the first appearance of rust pustules.")
                            .prevention("Plant rust-resistant wheat varieties (the most effective control method). Keep field borders clear of wild host grasses. Practice crop rotation with non-cereal crops.")
                            .build(),
                    DiseaseInfo.builder()
                            .cropName("Wheat")
                            .diseaseName("Powdery Mildew")
                            .symptoms("Superficial, white-to-gray powdery fungal patches on the upper surface of leaves, sheaths, and stems. These patches turn dull gray or brown as the fungus matures, with tiny black dots (cleistothecia) embedding within.")
                            .treatment("Spray wettable sulfur (2g/L) or systemic triazole fungicides like Hexaconazole or Propiconazole if weather is cool and damp and disease levels cross threshold limits.")
                            .prevention("Avoid excessive planting density to allow sunlight penetration and airflow. Do not over-fertilize with nitrogen. Rotate crops annually.")
                            .build(),

                    // ── TOMATO DISEASES ──────────────────────────────
                    DiseaseInfo.builder()
                            .cropName("Tomato")
                            .diseaseName("Early Blight")
                            .symptoms("Irregular dark brown or black spots with concentric rings (target-like pattern) appearing first on older leaves. Leaves turn yellow, wither, and drop. Can also cause dark sunken spots near the stem end of fruits.")
                            .treatment("Apply protective fungicides like Chlorothalonil or Mancozeb every 7-10 days in warm, wet weather. Remove infected lower leaves to reduce spores bouncing from soil.")
                            .prevention("Ensure crop rotation of at least 3 years away from Solanaceous crops (potatoes, eggplants). Apply mulch to prevent soil splashing onto foliage. Water plants at the base (avoid overhead irrigation).")
                            .build(),
                    DiseaseInfo.builder()
                            .cropName("Tomato")
                            .diseaseName("Late Blight")
                            .symptoms("Large, irregular, water-soaked dark greenish-black lesions on leaves and stems that rapidly expand. Under humid conditions, a white velvety mold forms on the underside of infected leaves. Fruits develop firm, dark brown, greasy spots.")
                            .treatment("This is a highly destructive disease. Spray preventative fungicides like Mancozeb or Copper Hydroxide. If disease is active, apply systemic fungicides containing Metalaxyl or Azoxystrobin.")
                            .prevention("Destroy any potato or tomato volunteer plants in the vicinity. Use drip irrigation. Select resistant varieties. Ensure excellent drainage and ventilation.")
                            .build(),

                    // ── POTATO DISEASES ──────────────────────────────
                    DiseaseInfo.builder()
                            .cropName("Potato")
                            .diseaseName("Common Scab")
                            .symptoms("Corky, rough, brown lesions that can be raised, pitted, or flat on the tuber skin. Although it does not rot the tuber or affect cooking quality, it heavily degrades market value.")
                            .treatment("Maintain soil pH below 5.2 (scab bacteria cannot thrive in acidic soil). Ensure adequate soil moisture during the first 4-6 weeks of tuber development (critical stage).")
                            .prevention("Use certified scab-free seed potatoes. Rotate potatoes with green manure crops like alfalfa, rye, or oats. Avoid using fresh manure or lime right before planting potatoes.")
                            .build(),
                    DiseaseInfo.builder()
                            .cropName("Potato")
                            .diseaseName("Black Scurf")
                            .symptoms("Hard, dark brown or black dirt-like patches (sclerotia) adhering firmly to the tuber surface that do not wash off. Also causes \"canker\" on underground stems and stolons, leading to stunted plants or aerial tubers.")
                            .treatment("Treat seed tubers with fungicides containing Fludioxonil or Pencycuron before planting. Apply Azoxystrobin in-furrow during planting for soil-borne protection.")
                            .prevention("Harvest tubers immediately after vine kill (prolonged time in soil increases scurf accumulation). Plant seeds only when soil temperatures reach above 10°C to speed up emergence.")
                            .build()
            );

            diseaseInfoRepository.saveAll(seeds);
            log.info("Database seeded successfully with {} disease reference records.", seeds.size());
        } else {
            log.info("Database disease_info table already contains data. Skipping seeder.");
        }
    }
}
