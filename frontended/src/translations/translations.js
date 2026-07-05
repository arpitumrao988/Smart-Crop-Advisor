// ============================================================
// translations.js — All English + Hindi text strings
//
// HOW TO USE IN ANY COMPONENT:
//   import { useLanguage } from "../context/LanguageContext";
//   const { t } = useLanguage();
//   Then use: t.home.heroTitle  OR  t.navbar.home  etc.
// ============================================================

const translations = {
    en: {
      navbar: {
        brand:        "Smart Crop Advisor",
        home:         "Home",
        dashboard:    "Dashboard",
        advisories:   "Advisories ▾",
        crop:         "🌾 Crop Recommendation",
        fertilizer:   "💊 Fertilizer",
        irrigation:   "💧 Irrigation",
        disease:      "🦠 Disease Detection",
        login:        "Login",
        register:     "Register",
        logout:       "Logout",
      },
  
      home: {
        badge:            "🌿 AI-Powered Agriculture",
        heroTitle:        "Smart Farming Starts",
        heroHighlight:    "With Smart Data",
        heroDesc:         "Get AI-generated, personalized recommendations for crops, fertilizers, irrigation, and disease detection — all based on your real field conditions. Built by farmers, for farmers.",
        goToDashboard:    "🌾 Go to Dashboard",
        getStarted:       "🌱 Get Started Free",
        loginBtn:         "🔑 Login",
        statAccuracy:     "Crop Model Accuracy",
        statCrops:        "Crops Supported",
        statModels:       "AI Models",
        whatWeOffer:      "What We Offer",
        whatWeOfferSub:   "Four intelligent advisory services powered by trained Machine Learning models",
        howItWorks:       "How It Works",
        howItWorksSub:    "Four simple steps from soil data to actionable recommendations",
        builtWith:        "Built With Modern Technology",
        builtWithSub:     "A three-tier full-stack architecture — frontend, backend, and AI",
        ctaTitle:         "Ready to Farm Smarter?",
        ctaDesc:          "Create your free account and get your first recommendation in minutes.",
        ctaBtn:           "🌱 Start Now — It's Free",
        features: [
          { title: "Crop Recommendation",  desc: "Enter your soil NPK values, temperature, humidity, pH, and rainfall to get the best crop recommendation powered by ML." },
          { title: "Fertilizer Advisory",  desc: "Get personalized fertilizer recommendations based on your crop choice and soil nutrient levels." },
          { title: "Irrigation Guidance",  desc: "Know exactly how much water your crop needs and how frequently to irrigate based on real conditions." },
          { title: "Disease Detection",    desc: "Describe visible symptoms and get instant disease identification with treatment and prevention guidance." },
        ],
        steps: [
          { step: "01", title: "Enter Field Data",    desc: "Input your soil values and local climate conditions." },
          { step: "02", title: "AI Analysis",         desc: "Our ML models analyze your data in real time." },
          { step: "03", title: "Get Recommendation",  desc: "Receive personalized, actionable agricultural advice." },
          { step: "04", title: "Track Your History",  desc: "All recommendations are saved for future reference." },
        ],
      },
  
      login: {
        title:          "Welcome Back",
        subtitle:       "Sign in to your Smart Crop Advisor account",
        emailLabel:     "Email Address",
        emailPlaceholder: "farmer@example.com",
        passwordLabel:  "Password",
        passwordPlaceholder: "Enter your password",
        signingIn:      "Signing in...",
        signInBtn:      "🔑 Sign In",
        noAccount:      "Don't have an account?",
        createHere:     "Create one here",
        fillBoth:       "Please fill in both email and password.",
      },
  
      register: {
        title:            "Create Account",
        subtitle:         "Join Smart Crop Advisor and farm smarter today",
        nameLabel:        "Full Name",
        namePlaceholder:  "Ramesh Kumar",
        locationLabel:    "Location / Village",
        locationPlaceholder: "Varanasi, Uttar Pradesh",
        emailLabel:       "Email Address",
        emailPlaceholder: "farmer@example.com",
        passwordLabel:    "Password",
        passwordPlaceholder: "Min. 6 characters",
        confirmLabel:     "Confirm Password",
        confirmPlaceholder: "Repeat password",
        creating:         "Creating account...",
        createBtn:        "🌱 Create My Account",
        haveAccount:      "Already have an account?",
        signInHere:       "Sign in here",
        allRequired:      "All fields are required.",
        passwordMismatch: "Passwords do not match.",
        passwordShort:    "Password must be at least 6 characters.",
        successMsg:       "Account created! Redirecting to login...",
      },
  
      dashboard: {
        greeting:           "Welcome back",
        subtitle:           "Here's your agricultural advisory summary and recent activity.",
        totalRec:           "Total Recommendations",
        cropRec:            "Crop Recommendations",
        fertRec:            "Fertilizer Advisories",
        lastActive:         "Last Active",
        never:              "Never",
        quickActions:       "Quick Actions",
        recentRec:          "Recent Recommendations",
        noRec:              "No recommendations yet.",
        noRecSub:           "Try the Crop Recommendation feature to get started!",
        getFirstRec:        "Get First Recommendation",
        type:               "Type",
        result:             "Result",
        confidence:         "Confidence",
        date:               "Date",
        na:                 "N/A",
      },
  
      cropRecommend: {
        title:        "Crop Recommendation",
        subtitle:     "Enter your soil and climate data to get the best crop for your field",
        nitrogen:     "Nitrogen (N)",
        phosphorus:   "Phosphorus (P)",
        potassium:    "Potassium (K)",
        temperature:  "Temperature (°C)",
        humidity:     "Humidity (%)",
        ph:           "Soil pH",
        rainfall:     "Rainfall (mm)",
        submitBtn:    "🌾 Get Crop Recommendation",
        loading:      "Analyzing...",
      },
  
      profile: {
        title:          "My Profile",
        name:           "Full Name",
        email:          "Email Address",
        location:       "Location",
        memberSince:    "Member Since",
        editBtn:        "Edit Profile",
        saveBtn:        "Save Changes",
        cancelBtn:      "Cancel",
        deleteBtn:      "Delete Account",
        deleteConfirm:  "Are you sure you want to delete your account? This cannot be undone.",
        saving:         "Saving...",
        deleting:       "Deleting...",
      },
  
      common: {
        loading:    "Loading...",
        error:      "Something went wrong. Please try again.",
        retry:      "Retry",
        close:      "Close",
      },
    },
  
    // ── HINDI TRANSLATIONS ────────────────────────────────────
    hi: {
      navbar: {
        brand:        "स्मार्ट क्रॉप एडवाइजर",
        home:         "होम",
        dashboard:    "डैशबोर्ड",
        advisories:   "सलाह ▾",
        crop:         "🌾 फसल अनुशंसा",
        fertilizer:   "💊 उर्वरक",
        irrigation:   "💧 सिंचाई",
        disease:      "🦠 रोग पहचान",
        login:        "लॉगिन",
        register:     "रजिस्टर",
        logout:       "लॉगआउट",
      },
  
      home: {
        badge:            "🌿 AI-संचालित कृषि",
        heroTitle:        "स्मार्ट खेती की शुरुआत",
        heroHighlight:    "स्मार्ट डेटा से",
        heroDesc:         "अपनी असली खेत की स्थिति के आधार पर फसल, उर्वरक, सिंचाई और रोग पहचान के लिए AI से व्यक्तिगत सुझाव पाएं। किसानों के लिए, किसानों द्वारा बनाया गया।",
        goToDashboard:    "🌾 डैशबोर्ड पर जाएं",
        getStarted:       "🌱 मुफ्त शुरू करें",
        loginBtn:         "🔑 लॉगिन",
        statAccuracy:     "फसल मॉडल की सटीकता",
        statCrops:        "समर्थित फसलें",
        statModels:       "AI मॉडल",
        whatWeOffer:      "हम क्या प्रदान करते हैं",
        whatWeOfferSub:   "प्रशिक्षित मशीन लर्निंग मॉडल द्वारा संचालित चार बुद्धिमान सलाह सेवाएं",
        howItWorks:       "यह कैसे काम करता है",
        howItWorksSub:    "मिट्टी के डेटा से उपयोगी सुझावों तक चार सरल कदम",
        builtWith:        "आधुनिक तकनीक से बनाया गया",
        builtWithSub:     "तीन-स्तरीय फुल-स्टैक आर्किटेक्चर — फ्रंटएंड, बैकएंड और AI",
        ctaTitle:         "स्मार्ट तरीके से खेती करने के लिए तैयार हैं?",
        ctaDesc:          "अपना मुफ्त खाता बनाएं और मिनटों में पहली सिफारिश पाएं।",
        ctaBtn:           "🌱 अभी शुरू करें — यह मुफ्त है",
        features: [
          { title: "फसल अनुशंसा",   desc: "ML द्वारा संचालित सर्वोत्तम फसल सुझाव पाने के लिए अपने मिट्टी के NPK मान, तापमान, आर्द्रता, pH और वर्षा दर्ज करें।" },
          { title: "उर्वरक सलाह",   desc: "अपनी फसल की पसंद और मिट्टी के पोषक तत्वों के स्तर के आधार पर व्यक्तिगत उर्वरक सुझाव पाएं।" },
          { title: "सिंचाई मार्गदर्शन", desc: "जानें कि वास्तविक परिस्थितियों के आधार पर आपकी फसल को कितने पानी और कितनी बार सिंचाई की जरूरत है।" },
          { title: "रोग पहचान",     desc: "दिखाई देने वाले लक्षणों का वर्णन करें और उपचार एवं रोकथाम के मार्गदर्शन के साथ तुरंत रोग की पहचान करें।" },
        ],
        steps: [
          { step: "01", title: "खेत का डेटा दर्ज करें", desc: "अपने मिट्टी के मान और स्थानीय जलवायु स्थितियां दर्ज करें।" },
          { step: "02", title: "AI विश्लेषण",           desc: "हमारे ML मॉडल आपके डेटा का वास्तविक समय में विश्लेषण करते हैं।" },
          { step: "03", title: "सुझाव पाएं",            desc: "व्यक्तिगत, कार्यात्मक कृषि सलाह प्राप्त करें।" },
          { step: "04", title: "इतिहास ट्रैक करें",    desc: "सभी सुझाव भविष्य के संदर्भ के लिए सहेजे जाते हैं।" },
        ],
      },
  
      login: {
        title:            "वापस स्वागत है",
        subtitle:         "अपने स्मार्ट क्रॉप एडवाइजर खाते में साइन इन करें",
        emailLabel:       "ईमेल पता",
        emailPlaceholder: "farmer@example.com",
        passwordLabel:    "पासवर्ड",
        passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
        signingIn:        "साइन इन हो रहा है...",
        signInBtn:        "🔑 साइन इन करें",
        noAccount:        "खाता नहीं है?",
        createHere:       "यहां बनाएं",
        fillBoth:         "कृपया ईमेल और पासवर्ड दोनों भरें।",
      },
  
      register: {
        title:            "खाता बनाएं",
        subtitle:         "स्मार्ट क्रॉप एडवाइजर से जुड़ें और स्मार्ट तरीके से खेती करें",
        nameLabel:        "पूरा नाम",
        namePlaceholder:  "रमेश कुमार",
        locationLabel:    "स्थान / गाँव",
        locationPlaceholder: "वाराणसी, उत्तर प्रदेश",
        emailLabel:       "ईमेल पता",
        emailPlaceholder: "farmer@example.com",
        passwordLabel:    "पासवर्ड",
        passwordPlaceholder: "कम से कम 6 अक्षर",
        confirmLabel:     "पासवर्ड की पुष्टि करें",
        confirmPlaceholder: "पासवर्ड दोबारा दर्ज करें",
        creating:         "खाता बन रहा है...",
        createBtn:        "🌱 मेरा खाता बनाएं",
        haveAccount:      "पहले से खाता है?",
        signInHere:       "यहां साइन इन करें",
        allRequired:      "सभी फ़ील्ड आवश्यक हैं।",
        passwordMismatch: "पासवर्ड मेल नहीं खाते।",
        passwordShort:    "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
        successMsg:       "खाता बन गया! लॉगिन पर भेजा जा रहा है...",
      },
  
      dashboard: {
        greeting:         "वापस स्वागत है",
        subtitle:         "यहां आपकी कृषि सलाह का सारांश और हाल की गतिविधि है।",
        totalRec:         "कुल सुझाव",
        cropRec:          "फसल सुझाव",
        fertRec:          "उर्वरक सलाह",
        lastActive:       "अंतिम सक्रिय",
        never:            "कभी नहीं",
        quickActions:     "त्वरित कार्य",
        recentRec:        "हाल के सुझाव",
        noRec:            "अभी तक कोई सुझाव नहीं।",
        noRecSub:         "शुरू करने के लिए फसल सुझाव सुविधा आज़माएं!",
        getFirstRec:      "पहला सुझाव पाएं",
        type:             "प्रकार",
        result:           "परिणाम",
        confidence:       "विश्वास",
        date:             "तारीख",
        na:               "N/A",
      },
  
      cropRecommend: {
        title:        "फसल अनुशंसा",
        subtitle:     "अपने खेत के लिए सबसे अच्छी फसल पाने के लिए मिट्टी और जलवायु डेटा दर्ज करें",
        nitrogen:     "नाइट्रोजन (N)",
        phosphorus:   "फास्फोरस (P)",
        potassium:    "पोटेशियम (K)",
        temperature:  "तापमान (°C)",
        humidity:     "आर्द्रता (%)",
        ph:           "मिट्टी pH",
        rainfall:     "वर्षा (mm)",
        submitBtn:    "🌾 फसल सुझाव पाएं",
        loading:      "विश्लेषण हो रहा है...",
      },
  
      profile: {
        title:          "मेरी प्रोफ़ाइल",
        name:           "पूरा नाम",
        email:          "ईमेल पता",
        location:       "स्थान",
        memberSince:    "सदस्य कब से",
        editBtn:        "प्रोफ़ाइल संपादित करें",
        saveBtn:        "बदलाव सहेजें",
        cancelBtn:      "रद्द करें",
        deleteBtn:      "खाता हटाएं",
        deleteConfirm:  "क्या आप वाकई अपना खाता हटाना चाहते हैं? यह पूर्ववत नहीं किया जा सकता।",
        saving:         "सहेजा जा रहा है...",
        deleting:       "हटाया जा रहा है...",
      },
  
      common: {
        loading:    "लोड हो रहा है...",
        error:      "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        retry:      "पुनः प्रयास करें",
        close:      "बंद करें",
      },
    },
  };

  // ── Mappings for Dynamic AI Outputs ──
  const cropMap = {
    rice: "चावल (Rice)",
    maize: "मक्का (Maize)",
    chickpea: "चना (Chickpea)",
    kidneybeans: "राजमा (Kidney Beans)",
    pigeonpeas: "अरहर/तुअर (Pigeon Peas)",
    mothbeans: "मोठ बीन (Moth Beans)",
    mungbean: "मूंग (Mung Bean)",
    blackgram: "उड़द (Black Gram)",
    lentil: "मसूर (Lentil)",
    pomegranate: "अनार (Pomegranate)",
    banana: "केला (Banana)",
    mango: "आम (Mango)",
    grapes: "अंगूर (Grapes)",
    watermelon: "तरबूज (Watermelon)",
    muskmelon: "खरबूजा (Muskmelon)",
    apple: "सेब (Apple)",
    orange: "संतरा (Orange)",
    papaya: "पपीता (Papaya)",
    coconut: "नारियल (Coconut)",
    cotton: "कपास (Cotton)",
    jute: "पटसन (Jute)",
    coffee: "कॉफ़ी (Coffee)",
    wheat: "गेहूं (Wheat)",
    tomato: "टमाटर (Tomato)",
    potato: "आलू (Potato)"
  };

  const fertilizerMap = {
    "urea": "यूरिया (Urea)",
    "dap": "डीएपी (DAP)",
    "npk 19-19-19 (balanced fertilizer)": "एनपीके 19-19-19 (संतुलित उर्वरक)",
    "npk 10-26-26": "एनपीके 10-26-26",
    "npk 12-32-16": "एनपीके 12-32-16",
    "ssp": "एसएसपी (Single Super Phosphate)",
    "mop": "एमओपी (Muriate of Potash)"
  };

  const diseaseMap = {
    "bacterial leaf blight": "बैक्टेरियल लीफ ब्लाइट (जीवाणु झुलसा)",
    "blast": "ब्लास्ट रोग (झुलसा)",
    "leaf rust": "पत्ती का गेरूआ (Leaf Rust)",
    "powdery mildew": "पाउडरी मिल्ड्यू (चूर्णिल आसिता)",
    "early blight": "अगेती झुलसा (Early Blight)",
    "late blight": "पछेती झुलसा (Late Blight)",
    "common scab": "सामान्य खुरदरा रोग (Common Scab)",
    "black scurf": "ब्लैक स्कर्फ रोग (Black Scurf)",
    "brown spot": "भूरा धब्बा रोग (Brown Spot)",
    "panama disease": "पनामा रोग (Panama Disease)",
    "black sigatoka": "ब्लैक सिगाटोका (Black Sigatoka)",
    "bacterial blight": "जीवाणु झुलसा (Bacterial Blight)",
    "common rust": "सामान्य गेरूआ (Common Rust)",
    "downy mildew": "मृदुरोमिल आसिता (Downy Mildew)",
    "leaf blight": "पत्ती झुलसा (Leaf Blight)",
    "leaf curl": "पर्ण कुंचन (Leaf Curl)",
    "leaf spot": "पत्ती धब्बा (Leaf Spot)",
    "red rot": "लाल सड़न रोग (Red Rot)",
    "root rot": "जड़ सड़न (Root Rot)",
    "rust": "गेरूआ रोग (Rust)",
    "wilt": "मुरझान रोग (Wilt)",
    "healthy (no disease detected)": "स्वस्थ (कोई रोग नहीं पाया गया)",
    "healthy": "स्वस्थ (कोई रोग नहीं)"
  };

  const commonMap = {
    "low": "कम (Low)",
    "medium": "मध्यम (Medium)",
    "high": "उच्च (High)",
    "dry": "सूखा",
    "moderate": "मध्यम",
    "wet": "गीला",
    "drip irrigation": "टपक सिंचाई (Drip)",
    "flood irrigation": "बाढ़ सिंचाई (Flood)",
    "once every day (early morning)": "हर दिन एक बार (सुबह जल्दी)",
    "once every day": "हर दिन एक बार",
    "once every 2 days": "2 दिनों में एक बार",
    "once every 3-4 days": "3-4 दिनों में एक बार",
    "as required (check moisture levels)": "आवश्यकतानुसार (नमी स्तर की जांच करें)",
    "0 liters (no immediate watering)": "0 लीटर (तत्काल सिंचाई की आवश्यकता नहीं)",
    "8-10 liters/day per plant": "8-10 लीटर/दिन प्रति पौधा",
    "4-6 liters/day per plant": "4-6 लीटर/दिन प्रति पौधा",
    "vegetative": "वानस्पतिक (Vegetative)",
    "flowering": "पुष्पन (Flowering)",
    "fruiting": "फलने (Fruiting)"
  };

  export const translateTerm = (text, lang) => {
    if (!text || lang !== "hi") return text;
    
    const cleanText = text.toString().trim();
    const lower = cleanText.toLowerCase();
    
    if (cropMap[lower]) return cropMap[lower];
    if (fertilizerMap[lower]) return fertilizerMap[lower];
    if (diseaseMap[lower]) return diseaseMap[lower];
    if (commonMap[lower]) return commonMap[lower];
    
    // Try partial lookup
    for (const [en, hi] of Object.entries(fertilizerMap)) {
      if (lower.includes(en)) return hi;
    }
    for (const [en, hi] of Object.entries(diseaseMap)) {
      if (lower.includes(en)) return hi;
    }
    for (const [en, hi] of Object.entries(commonMap)) {
      if (lower.includes(en)) return hi;
    }
    for (const [en, hi] of Object.entries(cropMap)) {
      if (lower.includes(en)) return hi;
    }
    
    return cleanText;
  };

  export const translateSentence = (text, lang) => {
    if (!text || lang !== "hi") return text;
    
    let translated = text.toString();
    
    // 1. Crop Advisory template translation
    const cropRegex = /Based on your soil NPK levels, pH of ([\d.]+), temperature of ([\d.]+)°C, and rainfall of ([\d.]+)mm, ([\w\s-]+) is highly recommended\.( It exhibits strong yield potential under these conditions\.)?/i;
    if (cropRegex.test(translated)) {
      translated = translated.replace(cropRegex, (match, ph, temp, rain, crop) => {
        const hiCrop = translateTerm(crop, "hi");
        return `आपकी मिट्टी के एनपीके (NPK) स्तर, pH ${ph}, तापमान ${temp}°C और वर्षा ${rain}mm के आधार पर, **${hiCrop}** की अत्यधिक सिफारिश की जाती है। यह इन परिस्थितियों में मजबूत उपज क्षमता प्रदर्शित करता है।`;
      });
    }
    
    // 2. Fertilizer Advisory template translation
    const fertRegex = /For crop ([\w\s-]+) in ([\w\s-]+) soil with Nitrogen=([\d.]+), Phosphorus=([\d.]+), Potassium=([\d.]+), apply ([\w\d\s\(\)-]+)\.( Ensure uniform spreading and water the soil immediately after application\.)?/i;
    if (fertRegex.test(translated)) {
      translated = translated.replace(fertRegex, (match, crop, soil, n, p, k, fert) => {
        const hiCrop = translateTerm(crop, "hi");
        const hiSoil = translateTerm(soil, "hi");
        const hiFert = translateTerm(fert, "hi");
        return `**${hiSoil}** मिट्टी में **${hiCrop}** फसल के लिए जिसमें नाइट्रोजन=${n}, फास्फोरस=${p}, पोटेशियम=${k} है, **${hiFert}** का उपयोग करें। समान रूप से फैलाना सुनिश्चित करें और छिड़काव के तुरंत बाद मिट्टी में पानी दें।`;
      });
    }
    
    // 3. Common Irrigation & Disease sentences
    const sentenceMap = {
      "Critical dry levels detected. Irrigate immediately. Drip irrigation is highly recommended to conserve water and target root zones directly.": 
        "अत्यधिक शुष्क स्तर का पता चला है। तुरंत सिंचाई करें। पानी बचाने और सीधे जड़ क्षेत्रों को लक्षित करने के लिए टपक सिंचाई (ड्रिप) की अत्यधिक सिफारिश की जाती है।",
      "Moisture is at a moderate level. Maintain irrigation schedule but monitor temperature. Avoid waterlogging during vegetative stage.": 
        "आर्द्रता मध्यम स्तर पर है। सिंचाई अनुसूची बनाए रखें लेकिन तापमान की निगरानी करें। वानस्पतिक (Vegetative) चरण के दौरान जलभराव से बचें।",
      "Moisture is at a moderate level. Maintain irrigation schedule but monitor temperature. Avoid waterlogging during flowering stage.": 
        "आर्द्रता मध्यम स्तर पर है। सिंचाई अनुसूची बनाए रखें लेकिन तापमान की निगरानी करें। पुष्पन (Flowering) चरण के दौरान जलभराव से बचें।",
      "Moisture is at a moderate level. Maintain irrigation schedule but monitor temperature. Avoid waterlogging during fruiting stage.": 
        "आर्द्रता मध्यम स्तर पर है। सिंचाई अनुसूची बनाए रखें लेकिन तापमान की निगरानी करें। फलने (Fruiting) चरण के दौरान जलभराव से बचें।",
      "Soil moisture is sufficient. No irrigation is needed. Ensure field has proper drainage to avoid root rot.": 
        "मिट्टी की नमी पर्याप्त है। तत्काल सिंचाई की कोई आवश्यकता नहीं है। जड़ सड़न से बचने के लिए सुनिश्चित करें कि खेत में उचित जल निकासी हो।",
      "The crop is currently in its sensitive flowering stage; water stress now can significantly reduce yields.": 
        "फसल वर्तमान में अपने संवेदनशील पुष्पन (Flowering) चरण में है; इस समय पानी की कमी से उपज में काफी कमी आ सकती है।",
      "The crop is currently in its sensitive fruiting stage; water stress now can significantly reduce yields.": 
        "फसल वर्तमान में अपने संवेदनशील फलने (Fruiting) चरण में है; इस समय पानी की कमी से उपज में काफी कमी आ सकती है।",
      "No treatment required. Crop appears healthy.": 
        "कोई उपचार आवश्यक नहीं है। फसल स्वस्थ प्रतीत होती है।",
      "Maintain regular crop monitoring and standard watering schedule.": 
        "नियमित फसल निगरानी और मानक सिंचाई अनुसूची बनाए रखें।",
      "Consult local agricultural extension office. Remove infected leaves/plants immediately to prevent spread. Apply general-purpose organic fungicide if fungal characteristics are present.":
        "स्थानीय कृषि विस्तार कार्यालय से परामर्श करें। प्रसार को रोकने के लिए संक्रमित पत्तियों/पौधों को तुरंत हटा दें। यदि फंगल लक्षण मौजूद हैं तो सामान्य प्रयोजन के जैविक कवकनाशी का प्रयोग करें।",
      "Maintain clean farming equipment, keep proper spacing between crops, and avoid overhead watering.":
        "कृषि उपकरणों को साफ रखें, फसलों के बीच उचित दूरी बनाए रखें और सिर के ऊपर से पानी देने (छिड़काव) से बचें।"
    };
    
    for (const [en, hi] of Object.entries(sentenceMap)) {
      translated = translated.replace(en, hi);
    }
    
    return translated;
  };
  
  export default translations;