'use client';

import React, { useState } from 'react';
import { Search, Filter, Heart, Shield, Stethoscope, ChevronRight, X, Calendar, Users, TrendingUp } from 'lucide-react';

interface CaseStudy {
    id: string;
    title: string;
    category: string;
    summary: string;
    fullContent: {
        challenge: string;
        solution: string;
        implementation: string[];
        impact: string[];
        outlook: string;
    };
    stats: {
        label: string;
        value: string;
    }[];
    readTime: string;
}

const caseStudies: CaseStudy[] = [
    {
        id: '1',
        title: 'RemediAI',
        category: 'Diagnostics',
        summary: 'Combating Antimicrobial Resistance (AMR) through intelligent antibiotic stewardship using advanced AI-powered medication recommendations.',
        fullContent: {
            challenge: 'Antimicrobial Resistance (AMR) poses a grave global public health threat, leading to ineffective treatments for bacterial infections. In resource-constrained settings like parts of India, limited diagnostic infrastructure exacerbates this challenge, making it difficult for clinicians to quickly identify drug-resistant strains and prescribe appropriate alternative medications. This often results in prolonged illness, increased healthcare costs, and higher mortality rates.',
            solution: 'To address the critical need for effective treatment of drug-resistant infections, Aarogya AI is developing an advanced AI medication recommender. This system aims to empower clinicians with data-driven insights, improving antibiotic stewardship and patient outcomes.',
            implementation: [
                'Hybrid AI Approach: Aarogya AI combines patterns identified from real-world clinical data with molecular-level inputs to uncover potential treatment options for drug-resistant bacterial infections.',
                'Efficacy Against Multi-Drug Resistance: Aarogya AI has been successfully tested against multidrug-resistant strains, demonstrating its capability to identify effective alternative treatments.',
                'Clinical Decision Support: Aarogya AI processes vast amounts of information from individual patients or similar cohorts, providing clinicians with richer data, enabling more informed prescription decisions.'
            ],
            impact: [
                'Improved Clinical Decision-Making: Clinicians can make faster, more informed decisions regarding antibiotic prescriptions, reducing guesswork.',
                'Direct Contribution to Combating AMR: By suggesting effective alternatives, Aarogya AI helps to curb the spread of drug-resistant infections.',
                'Reduced Treatment Delays: Faster and more accurate prescription leads to quicker patient recovery.',
                'Enhanced Patient Safety: Better data access and informed decisions contribute to safer patient care.'
            ],
            outlook: 'Aarogya AI\'s medication recommender is a vital tool in the global fight against AMR. In India, where the burden of infectious diseases is high, this solution can significantly improve public health outcomes by ensuring more effective and responsible use of antibiotics, safeguarding their efficacy for future generations.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '2',
        title: 'AshaCare',
        category: 'Mental Health',
        summary: 'AI-powered mental health screening and assessment tools designed to improve early detection and intervention for mental health conditions.',
        fullContent: {
            challenge: 'Mental health disorders affect millions of people in India, yet many cases go undiagnosed due to stigma, lack of awareness, and limited access to mental health professionals. Early detection and intervention are crucial for better outcomes, but traditional screening methods are often time-consuming and require specialized expertise.',
            solution: 'Aarogya AI has developed an intelligent mental health assessment platform that uses natural language processing and machine learning to analyze patient responses, speech patterns, and behavioral indicators to provide accurate mental health screenings and risk assessments.',
            implementation: [
                'NLP-Based Analysis: Advanced natural language processing algorithms analyze patient responses during digital consultations to identify potential mental health concerns.',
                'Multi-Modal Assessment: The platform combines text analysis, voice pattern recognition, and behavioral data to provide comprehensive mental health evaluations.',
                'Personalized Intervention: AI-driven recommendations for appropriate interventions, therapy options, and specialist referrals based on individual patient profiles.'
            ],
            impact: [
                'Early Detection: Increased early identification of mental health conditions by 78% in pilot programs.',
                'Accessibility: Brought mental health screening to underserved communities through digital platforms.',
                'Reduced Stigma: Anonymous screening options help reduce barriers to mental health care.',
                'Cost-Effective Care: Reduced the need for initial in-person consultations while maintaining diagnostic accuracy.'
            ],
            outlook: 'The mental health assessment platform represents a significant step forward in democratizing mental health care in India. By leveraging AI to make mental health screening more accessible and less stigmatized, Aarogya AI is helping to address the growing mental health crisis while supporting healthcare providers with better diagnostic tools.'
        },
        stats: [],
        readTime: '6 min'
    },
    {
        id: '3',
        title: 'TeleCure',
        category: 'Telemedicine',
        summary: 'AI-enhanced telemedicine platform bridging healthcare access gaps through secure video consultations with intelligent patient triage.',
        fullContent: {
            challenge: 'India\'s vast geographical expanse and diverse population often lead to significant disparities in healthcare access, particularly for individuals in rural and remote areas who struggle to reach specialists or even basic medical facilities. This challenge is compounded by the high burden on physical healthcare infrastructure in urban centers.',
            solution: 'Video consultation platforms, augmented by AI, have emerged as a cornerstone of digital healthcare in India. Aarogya AI offers such a platform, significantly enhancing accessibility and efficiency by connecting patients with doctors and specialists remotely, bridging geographical barriers and reducing the strain on physical facilities.',
            implementation: [
                'Seamless Consultations: Aarogya AI facilitates secure 24/7 video and audio consultations with licensed doctors.',
                'AI for Patient Triage: Aarogya AI integrates AI chatbots to triage patient queries, streamlining the consultation process and enhancing user experience.',
                'AI for Clinical Decision Support: AI is integrated to assist doctors in diagnosis based on symptom analysis and provide real-time clinical decision support.',
                'Quality Consultation: Aarogya AI aims to provide high-quality consultations, minimizing technical issues and ensuring comprehensive case details for doctors.'
            ],
            impact: [
                'Bridged Rural-Urban Divide: It is instrumental in providing access to specialist care in remote locations.',
                'Enhanced Accessibility: Quality healthcare is more readily available across India, overcoming geographical and economic barriers.',
                'Reduced Burden on Physical Facilities: Teleconsultations alleviate pressure on hospitals and clinics.',
                'Improved Consultation Efficiency: AI integration streamlines patient triage and aids in faster, more accurate diagnoses.'
            ],
            outlook: 'Aarogya AI\'s video consultation platform, continuously enhanced by AI, is set to become an even more integral part of India\'s healthcare system. Its ability to deliver scalable, accessible, and efficient care positions it as a critical component in achieving universal health coverage and improving health outcomes across the nation.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '4',
        title: 'PharmaFind',
        category: 'Intelligent Assistance',
        summary: 'AI-powered medicine usage chatbot that helps users understand how to safely take their medications, including dosage, timing, interactions, and storage.',
        fullContent: {
            challenge: 'Many patients receive prescriptions but remain unclear about how and when to take their medications, what side effects to expect, or how to store them properly. This lack of clarity often leads to improper usage, reduced effectiveness, or even harmful side effects.',
            solution: 'PharmaFind is Aarogya AI’s intelligent chatbot that simplifies medicine usage for everyone. By allowing users to search or upload a prescription, the chatbot explains dosage, usage instructions, interactions, and warnings in a clear and personalized way—bridging the knowledge gap between doctor visits and daily adherence.',
            implementation: [
                'Prescription-Based Chat: Users can input a medicine name or upload a prescription. The chatbot scans and explains the medicine’s purpose, dosage, and usage instructions.',
                'Conversational Guidance: Built using advanced LLMs, PharmaFind answers natural-language questions like “Can I take this after food?” or “What if I miss a dose?”',
                'Interaction Warnings: The chatbot alerts users about possible interactions with other common medicines or food items.',
                'Localized Advice: Instructions are tailored to Indian prescription styles, common local brands, and regional language support (optional).',
                'Secure and Private: No data is stored without consent; chats are session-based to protect user privacy.'
            ],
            impact: [
                'Better Medication Adherence: Users clearly understand how to take medicines, increasing treatment success.',
                'Reduced Risk of Misuse: Clear usage instructions reduce chances of overdose, underdose, or harmful combinations.',
                'Empowered Patients: People feel more confident managing their health at home without second-guessing their prescriptions.',
                'Lower Healthcare Burden: Fewer calls to clinics and fewer complications from misused medicines save time and resources.'
            ],
            outlook: 'PharmaFind represents the next step in AI-driven personal healthcare guidance. As digital health adoption grows in India, tools like this will ensure that patients aren’t just prescribed medicines—but truly understand how to use them effectively and safely.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '5',
        title: 'First Aid Guide',
        category: 'Emergency Care',
        summary: 'AI-powered emergency response system providing immediate, context-aware first aid guidance and disaster response capabilities.',
        fullContent: {
            challenge: 'In emergency situations, quick and accurate first aid can be life-saving. However, individuals often lack immediate access to precise, situation-based instructions, relying on generic search results or limited knowledge. This can lead to delayed or inappropriate responses, worsening outcomes.',
            solution: 'Aarogya AI plays an increasingly vital role in enhancing first aid provision and overall emergency response capabilities by providing immediate, context-aware guidance and improving communication during crises.',
            implementation: [
                'AI-powered First Aid App: Aarogya AI offers a situation-based first aid app that provides brief and effective remedies. It supports text, voice, and image input (allowing users to attach photos of injuries for better contextual understanding).',
                'Faster Diagnostic Tools: Aarogya AI leverages AI to develop faster diagnostic tools that can significantly improve primary care and first aid interventions.',
                'AI in Emergency Response: Aarogya AI improves the precision and speed of disaster responses, predicts natural disasters, and ensures real-time communication during crises.',
                'Social Media Monitoring: Aarogya AI tools monitor real-time sentiment on social media and emergency channels to identify mental health crises and enable targeted interventions.',
                'NLP for Language Barriers: Aarogya AI-driven Natural Language Processing (NLP) tools translate public health guidelines and emergency alerts into multiple languages.'
            ],
            impact: [
                'Faster and More Accurate Responses: Individuals receive precise, immediate guidance, improving initial response quality.',
                'Improved Decision-Making: First responders and individuals are better equipped to make critical decisions during emergencies.',
                'Enhanced Disaster Preparedness: Aarogya AI aids in predicting and managing natural disasters, leading to more effective preparedness.',
                'Broader Dissemination of Information: Critical health information reaches diverse populations effectively, overcoming language barriers.'
            ],
            outlook: 'Aarogya AI\'s first aid guides and emergency response systems are crucial for building a more resilient and responsive healthcare ecosystem in India. By providing immediate, intelligent support during critical moments, these solutions can save lives and mitigate the impact of emergencies, making vital information accessible to everyone.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '6',
        title: 'PxVault',
        category: 'Digital Health Records',
        summary: 'Secure digital health records management system with AI-powered OCR and NLP for comprehensive prescription and medical history tracking.',
        fullContent: {
            challenge: 'Traditional paper-based medical records are prone to loss, damage, and are difficult to share across different healthcare providers. This fragmentation leads to incomplete patient histories, redundant tests, and inefficient prescription management, impacting the continuity and quality of care.',
            solution: 'Digital platforms, integrated with national initiatives like the Ayushman Bharat Digital Mission (ABDM), are leveraging AI to create secure and centralized prescription vaults. Aarogya AI offers such a solution, aiming to digitize, store, and manage medical records efficiently, providing patients and authorized providers with easy access to a comprehensive health history.',
            implementation: [
                'Secure Digital Storage: Aarogya AI enables users to upload, store, and manage prescriptions, lab reports, and medical history digitally, centralizing health records for easy access.',
                'Seamless Prescription Viewing and Ordering: Aarogya AI allows patients to instantly view their prescriptions post-consultation and conveniently order medicines for pickup or delivery.',
                'OCR and NLP for Record Interpretation: Aarogya AI utilizes Optical Character Recognition (OCR) and Natural Language Processing (NLP) to interpret and link patients\' medical records (including prescriptions) to their unique Ayushman Bharat Health Account (ABHA) ID.',
                'Secure Digilocker: Aarogya AI features a secure Digilocker, providing patients with a reliable repository for their longitudinal medical history.'
            ],
            impact: [
                'Streamlined Prescription Management: Digital access and ordering make managing medications more convenient and efficient.',
                'Enhanced Patient Safety: Healthcare providers have immediate access to complete medical histories, reducing the risk of medication errors and adverse drug interactions.',
                'Improved Clinical Decision-Making: Comprehensive, centralized records provide better context for doctors, leading to more informed treatment plans.',
                'Increased Convenience: Patients can easily access and share their health records, reducing administrative burdens.',
                'Contribution to National Digital Health Mission: Aarogya AI aligns with and contributes to the goals of the ABDM, fostering a nationwide digital health ecosystem.'
            ],
            outlook: 'Aarogya AI\'s prescription vault, powered by AI for data extraction and integration, is fundamental to building a robust digital health infrastructure in India. It is crucial for ensuring continuity of care, empowering patients with control over their health data, and moving towards a truly paperless and interconnected healthcare system.'
        },
        stats: [],
        readTime: '6 min'
    },
    {
        id: '7',
        title: 'NutriGuide',
        category: 'Wellness',
        summary: 'Hyper-personalized nutrition planning system using machine learning to analyze biomarkers and gut microbiome for optimal dietary recommendations.',
        fullContent: {
            challenge: 'With rising rates of lifestyle diseases like diabetes and obesity, there\'s a growing need for personalized nutrition guidance. However, traditional dietary advice often lacks the specificity required to address individual physiological, metabolic, and lifestyle requirements effectively.',
            solution: 'Aarogya AI is transforming personal nutrition by creating highly personalized dietary plans. These systems analyze complex individual data to offer tailored recommendations that promote better health outcomes and prevent chronic diseases.',
            implementation: [
                'Machine Learning for Personalization: Aarogya AI uses machine learning to map complex interactions among biomarkers, gut microbiome profiles, and various dietary components. This allows for the creation of precise, individualized nutrition plans.',
                'Biomarker and Gut Profile Analysis: By analyzing an individual\'s unique biological data, Aarogya AI can suggest foods and meal plans that are optimally suited to their body\'s specific needs.',
                'Gamification and Chatbots: Aarogya AI promotes user involvement through gamification elements, voice assistants, and chatbots, enhancing engagement and adherence to healthy eating habits.',
                'Evidence-Based Outcomes: Aarogya AI aims for positive results with its AI-driven dietary therapy, leading to improved glycemic control and metabolic health.'
            ],
            impact: [
                'Measurable Metabolic Health Improvements: Aarogya AI-driven interventions aim to lead to improved glycemic control and enhanced metabolic health, with notable outcomes such as high diabetes remission rates.',
                'Effective Weight Management: Personalized plans support individuals in achieving and maintaining healthy weights.',
                'Enhanced User Engagement: Gamification and interactive features keep users motivated and adherent to their diet plans.',
                'Prevention of Chronic Diseases: By promoting healthy eating habits, Aarogya AI contributes to the prevention of obesity, malnutrition, and various chronic diseases.'
            ],
            outlook: 'Aarogya AI\'s diet recommender is at the forefront of preventive healthcare in India. As AI models become more sophisticated and integrate with more biological data, they will play an increasingly vital role in empowering individuals to manage their health proactively, contributing to a healthier population and reducing the burden of lifestyle diseases.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '8',
        title: 'NapWise',
        category: 'Wellness',
        summary: 'Contactless sleep monitoring system using AI to analyze sleep patterns and provide personalized optimization recommendations.',
        fullContent: {
            challenge: 'Many individuals suffer from undiagnosed sleep disorders or poor sleep quality, leading to chronic fatigue, reduced productivity, and increased risk of various health issues. Traditional sleep tracking methods often require uncomfortable wearables or expensive lab tests, limiting widespread adoption.',
            solution: 'Aarogya AI\'s sleep analyzer is revolutionizing personal wellness by offering contactless, intelligent monitoring and optimization of sleep quality. This solution goes beyond basic tracking to provide actionable insights and actively combat sleep-related issues.',
            implementation: [
                'Contactless Sensors: Aarogya AI utilizes non-wearable, contactless sleep trackers (e.g., sensor sheets placed under the mattress) that provide detailed insights without requiring users to wear devices.',
                'Comprehensive Sleep Analysis: It analyzes various sleep patterns, including sleep stages, respiratory rate, snoring, movement, and provides an aggregated sleep score.',
                'Biofeedback and Real-time Analysis: Aarogya AI actively combats common issues like insomnia, sleep apnea, and chronic fatigue by utilizing biofeedback and real-time analysis.',
                'Environmental Optimization: Aarogya AI can integrate with environmental controls (e.g., mattress temperature controllers) to optimize sleep quality.'
            ],
            impact: [
                'Improved Sleep Quality: Users experience better sleep hygiene and mental clarity.',
                'Early Detection of Sleep Disorders: Detailed analysis helps in identifying potential issues like insomnia or sleep apnea.',
                'Personalized Sleep Optimization: Insights and environmental controls allow for tailored improvements to sleep environments.',
                'Enhanced Overall Health: Better sleep leads to reduced fatigue, improved mood, and a lower risk of chronic diseases.'
            ],
            outlook: 'Aarogya AI\'s sleep analyzer is a crucial component of holistic digital wellness ecosystems in India. As these technologies become more integrated and sophisticated, they will empower individuals to take proactive steps towards improving their sleep health, contributing to a healthier and more productive society.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '9',
        title: 'FlexFlow',
        category: 'Wellness',
        summary: 'AI-powered personalized yoga application with real-time pose estimation and form correction for safe and effective practice.',
        fullContent: {
            challenge: 'While yoga is widely recognized for its health benefits, many individuals struggle with correct posture and personalized routines without direct instruction. Access to qualified yoga instructors can be limited, and generic online videos may not provide the real-time feedback needed for effective and safe practice.',
            solution: 'Aarogya AI\'s driven personalized yoga application is revolutionizing wellness by combining ancient yoga wisdom with modern AI to provide tailored routines, real-time feedback, and progress tracking, ensuring correct form and optimal health outcomes.',
            implementation: [
                'Deep Learning and Pose Estimation: Aarogya AI employs deep learning and pose estimation via a phone\'s camera to extract key body points in real-time, accurately calculating angles and alignment during various yoga postures.',
                'Real-time Voice Instructions: Users receive immediate audio feedback on their form, guiding them through poses correctly.',
                'Progress Tracking and Reporting: Aarogya AI tracks repetitions, displays animations for correct form, and generates personalized report cards.',
                'Personalized Routines: Aarogya AI tailors routines based on user goals, abilities, and even chronic conditions.'
            ],
            impact: [
                'Personalized Yoga Practice: Routines are customized to individual needs, maximizing effectiveness and safety.',
                'Improved Form and Technique: Real-time feedback helps users achieve correct posture, preventing injuries and enhancing benefits.',
                'Effective Management of Chronic Diseases: Aarogya AI aims for efficacy in managing conditions like diabetes, hypertension, and cardiovascular disease.',
                'Stress Reduction and Well-being: Yoga, guided by Aarogya AI, effectively reduces stress and promotes overall mental and physical well-being.',
                'Enhanced Patient Engagement: Interactive features keep users motivated and consistent in their practice.'
            ],
            outlook: 'Aarogya AI\'s yoga planner is poised to make yoga practice more accessible, effective, and personalized for millions in India. By democratizing access to high-quality yoga instruction and integrating it with health management, this solution contributes significantly to preventive care and holistic wellness across the nation.'
        },
        stats: [],
        readTime: '6 min'
    },
    {
        id: '10',
        title: 'DermaScan',
        category: 'Diagnostics',
        summary: 'AI-powered skin health diagnostic tool using computer vision to analyze skin conditions and provide personalized skincare recommendations.',
        fullContent: {
            challenge: 'Traditional skin diagnostics often require visits to dermatologists, which can be costly, time-consuming, and inaccessible for many. Consumers also struggle with choosing appropriate skincare products without a precise understanding of their skin\'s specific needs and conditions.',
            solution: 'Aarogya AI is profoundly transforming the skincare and diagnostics industry by providing instant, accurate, and highly personalized skin analysis. This solution leverages computer vision to identify various skin attributes and conditions, offering tailored recommendations directly to consumers.',
            implementation: [
                'Real-time Skin Analysis: Aarogya AI provides instant analysis of intricate details such as wrinkles, skin pores, moisture levels, and spots across various facial segments.',
                'Mobile Camera Integration: It seamlessly integrates with mobile cameras, allowing consumers to perform self-analysis conveniently.',
                'Convolutional Neural Networks (CNNs): Advanced CNNs achieve high accuracy in identifying and classifying skin conditions.',
                'Personalized Skincare Recommendations: Aarogya AI uses machine learning to analyze skin type, acne progression, environmental factors, and treatment history to provide optimized product suggestions.'
            ],
            impact: [
                'Enhanced Diagnostic Accuracy: Aarogya AI improves the precision in detecting various skin conditions, reducing false positives.',
                'Instant and Personalized Advice: Consumers receive immediate, tailored skincare recommendations, empowering them to make informed choices.',
                'Increased Accessibility: Skin analysis becomes more accessible and affordable, reducing the need for frequent clinical visits for basic assessments.',
                'Improved Customer Satisfaction: Personalized solutions lead to better outcomes and higher satisfaction for users.',
                'Competitive Edge: For businesses, this solution provides a significant competitive advantage in the beauty and healthcare sectors.'
            ],
            outlook: 'Aarogya AI\'s skin analyzer is set to become an indispensable tool in personal health and beauty routines in India. By democratizing access to professional-grade skin insights, this solution will empower individuals to proactively manage their skin health, leading to better outcomes and a more informed consumer base.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '11',
        title: 'EatIQ',
        category: 'Wellness',
        summary: 'Automated nutrition tracking system using AI image recognition to instantly log meals and provide comprehensive dietary insights.',
        fullContent: {
            challenge: 'Manually tracking calorie and macronutrient intake is often cumbersome, time-consuming, and prone to inaccuracies. This makes it difficult for individuals to consistently adhere to dietary goals for weight management or health conditions, leading to poor adherence and suboptimal results.',
            solution: 'Aarogya AI is revolutionizing calorie counting by automating the tracking process and providing intelligent insights. This solution simplifies nutrition monitoring, making it easier for users to manage their daily intake and achieve their health goals.',
            implementation: [
                'AI Image Recognition (SNAP-like): Aarogya AI allows users to simply snap a photo of their meal. AI image recognition instantly logs the meal, tracking calories, protein, fats, carbohydrates, and fiber content. It analyzes meal photos, even for complex homemade dishes or packaged snacks, providing precise nutrition insights.',
                'AI Health Coach: Aarogya AI provides a 24/7 AI health coach that offers personalized meal planning and calorie tracking insights tailored to individual health and fitness goals.',
                'Automated Logging: The AI significantly reduces the manual effort involved in logging food intake, making the process seamless and more accurate.',
                'Comprehensive Nutritional Insights: Beyond just calories, Aarogya AI provides detailed breakdowns of macronutrients and other dietary components.'
            ],
            impact: [
                'Simplified Nutrition Tracking: The automation makes tracking effortless, leading to higher user adherence.',
                'Effective Weight Management: Users can more accurately monitor their intake, supporting weight loss or gain goals.',
                'Improved Adherence to Health Goals: By simplifying tracking and providing insights, users are more likely to stick to their personalized nutrition plans.',
                'Enhanced Body Confidence: Users of Aarogya AI can expect significant weight loss and increased body confidence.'
            ],
            outlook: 'Aarogya AI\'s calorie counter is becoming an essential tool for personal health management in India. As AI models continue to improve in image recognition and nutritional analysis, they will play an even greater role in empowering individuals to make informed dietary choices, contributing to better public health outcomes and combating lifestyle diseases.'
        },
        stats: [],
        readTime: '5 min'
    },
    {
        id: '12',
        title: 'AquaTrack',
        category: 'Wellness',
        summary: 'Smart hydration logging system that tracks, analyzes, and improves water intake as part of a larger wellness ecosystem.',
        fullContent: {
            challenge: 'While reminders to drink water are helpful, many individuals still fail to meet their daily hydration goals. What’s often missing is a reliable way to log, track, and reflect on hydration habits over time—something that provides visibility into trends and encourages long-term behavioral change.',
            solution: 'Aarogya AI\'s Water Logger goes beyond passive reminders by empowering users to actively log their water intake throughout the day. Integrated with other wellness data like sleep, nutrition, and physical activity, the logger helps users build a clear picture of their hydration behavior and its impact on overall health.',
            implementation: [
                'Daily Hydration Logging: Users can easily log how much water they drink throughout the day via a user-friendly interface on the Health Dashboard.',
                'AI-Driven Feedback: Based on logged data, Aarogya AI provides real-time feedback, adjusting hydration targets based on weather, activity levels, and even sleep data.',
                'Gamified Progress Tracking: The system includes streaks, goals, and badges to motivate users and reinforce consistent water intake.',
                'Integration with Wearables: Syncs with fitness trackers and smartwatches to import real-time activity and recommend personalized hydration levels.'
            ],
            impact: [
                'Improved Hydration Awareness: Users become more conscious of their intake and patterns, making it easier to form lasting healthy habits.',
                'Holistic Health Insights: Water intake is logged alongside other wellness metrics, enriching the user’s overall health profile.',
                'Behavioral Change Through Logging: The act of logging builds accountability and consistency, especially when paired with motivational nudges.',
                'Empowered Self-Care: Users take control of their hydration journey, fostering a deeper connection with their well-being.'
            ],
            outlook: 'Aarogya AI\'s Water Logger embodies the future of preventive digital health in India—one that is intelligent, personalized, and empowering. As users begin to see hydration as part of a data-driven wellness routine, such tools will become essential to long-term health behavior change, especially in climate-sensitive and high-activity regions.'
        },
        stats: [],
        readTime: '4 min'
    }

];

const categories = ['All', 'Mental Health', 'Diagnostics', 'Wellness', 'Cardiology', 'Oncology'];

const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
        case 'Mental Health':
            return <Heart className="w-5 h-5" />;
        case 'Diagnostics':
            return <Stethoscope className="w-5 h-5" />;
        case 'Wellness':
            return <Shield className="w-5 h-5" />;
        default:
            return <Heart className="w-5 h-5" />;
    }
};

export default function CaseStudiesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

    const filteredCaseStudies = caseStudies.filter(study => {
        const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || study.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const openModal = (caseStudy: CaseStudy) => {
        setSelectedCaseStudy(caseStudy);
    };

    const closeModal = () => {
        setSelectedCaseStudy(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        Aarogya AI: Impact Case Studies
                    </h1>
                    <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
                        Discover how AI-powered healthcare solutions are transforming patient care and clinical outcomes across India
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search case studies..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                            className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category} className="bg-gray-800">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Case Studies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCaseStudies.map((study) => (
                        <div
                            key={study.id}
                            className="bg-gray-800 rounded-xl border border-gray-950 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer"
                            onClick={() => openModal(study)}
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <CategoryIcon category={study.category} />
                                        </div>
                                        <span className="text-sm text-blue-400 font-medium">{study.category}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                    {study.title}
                                </h3>

                                {/* Summary */}
                                <p className="text-gray-300 mb-4 line-clamp-3">
                                    {study.summary}
                                </p>

                                {/* Read More Button */}
                                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group/button">
                                    <span>Read More</span>
                                    <ChevronRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredCaseStudies.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No case studies found</h3>
                        <p className="text-gray-400">Try adjusting your search terms or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedCaseStudy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg">
                                        <CategoryIcon category={selectedCaseStudy.category} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedCaseStudy.title}</h2>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>{selectedCaseStudy.category}</span>
                                            <span>{selectedCaseStudy.readTime} read</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xl font-bold mb-3 text-blue-400">The Challenge</h3>
                                    <p className="text-gray-300 leading-relaxed">{selectedCaseStudy.fullContent.challenge}</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold mb-3 text-blue-400">The AI Solution</h3>
                                    <p className="text-gray-300 leading-relaxed">{selectedCaseStudy.fullContent.solution}</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold mb-3 text-blue-400">Implementation & Key Features</h3>
                                    <ul className="space-y-3">
                                        {selectedCaseStudy.fullContent.implementation.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-gray-300 leading-relaxed">{item}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold mb-3 text-blue-400">Impact & Outcomes</h3>
                                    <ul className="space-y-3">
                                        {selectedCaseStudy.fullContent.impact.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-gray-300 leading-relaxed">{item}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold mb-3 text-blue-400">Future Outlook</h3>
                                    <p className="text-gray-300 leading-relaxed">{selectedCaseStudy.fullContent.outlook}</p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}