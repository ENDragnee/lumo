'use client';

import { useState, ReactNode } from 'react';
import {
    Briefcase,
    FileText,
    Calculator,
    Scale,
    Gavel,
    ScrollText,
    ListChecks,
    ClipboardCopy,
    CheckCircle,
    Building2,
    Handshake
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF slides 44-47) ---
const content = {
    am: {
        title: "ክፍል ሦስት: የንግድ ስራ ገቢ ግብር (ሰንጠረዥ ሐ)",
        langButton: "English",
        
        section3_1_Title: "3.1. ግብር የሚከፈልበት የንግድ ስራ ገቢ",
        taxableIncomeDef: "ግብር የሚከፈልበት የንግድ ስራ ገቢ የሚባለው በግብር ዓመቱ ከተገኘው ጠቅላላ የንግድ ስራ ገቢ ላይ በህግ የተፈቀዱ ወጪዎች ተቀንሰው የሚገኘው የተጣራ የገቢ መጠን ነው።",
        ifrsBasis: "ግብር የሚከፈልበት የንግድ ስራ ገቢ የሚወሰነው በአለም አቀፍ የፋይናንስ ሪፖርት አቀራረብ ደረጃዎች (IFRS) መሠረት በሚዘጋጀው የትርፍና ኪሳራ ወይም የገቢ መግለጫ ላይ በመመስረት ይሆናል።",
        legalHierarchy: "ሆኖም ግን፣ የሚከተሉት እንደተጠበቁ ይሆናሉ፦",
        laws: [
            "የገቢ ግብር አዋጅ ድንጋጌዎች",
            "የገቢ ግብር ደንብ",
            "የገንዘብ ሚኒስቴር የሚያወጣቸው መመሪያዎች"
        ],
        
        section3_2_Title: "3.2. የንግድ ስራ ገቢ",
        grossIncomeSources: "ጠቅላላ የንግድ ስራ ገቢ የሚከተሉትን ያካትታል፦",
        sources: [
            "ግብር ከፋዩ ዕቃዎችን በማስተላለፍ እና አገልግሎቶችን በመስጠት (መቀጠርን ሳይጨምር) የሚያገኘውን የገንዘብ መጠን።",
            "የንግድ ስራ ሃብትን በማስተላለፍ የሚገኝ የገንዘብ መጠን።",
            "የግብር ከፋዩ ገቢ ተደርገው የተወሰዱ ሌሎች ማናቸውም ገቢዎች።",
            "የካፒታል ንብረት የሆነን የንግድ ስራ ሃብት በማስተላለፍ በሚገኝ ጥቅም።"
        ],
        
        interactiveForm: {
            title: "ተግባራዊ መሳሪያ: የአዲስ ቤት ማስታወቂያ ቅጽ",
            instructions: "አዲስ ለኪራይ የቀረበን ቤት ለባለስልጣን ለማሳወቅ ይህን ቅጽ ይጠቀሙ። መረጃውን ይሙሉና የሚፈጠረውን ደብዳቤ ይመልከቱ።",
            step1: "ደረጃ 1: የቤቱን ሁኔታ ይምረጡ",
            built: "በግል የተገነባ",
            leased: "ተከራይቶ የሚከራይ",
            step2: "ደረጃ 2: መረጃዎን ያስገቡ",
            taxpayerName: "የግብር ከፋዩ ሙሉ ስም",
            tin: "የታክስ ከፋይ መለያ ቁጥር (TIN)",
            authorityName: "የሚመለከተው ባለስልጣን (ለምሳሌ: የቀበሌ አስተዳደር)",
            address: "የቤቱ ሙሉ አድራሻ (ክ/ከተማ፣ ወረዳ፣ የቤት ቁጥር)",
            step3: "ደረጃ 3: የተፈጠረ የማስታወቂያ ደብዳቤ",
            copy: "ኮፒ አድርግ",
            copied: "ኮፒ ሆኗል!",
            step4: "ደረጃ 4: የማስረከቢያ መስፈርቶች ዝርዝር",
            checklist: {
                built: [
                    "የተፈጠረውን የማስታወቂያ ደብዳቤ ህትመት (2 ኮፒ)",
                    "የባለቤትነት ማረጋገጫ ካርታ ፎቶ ኮፒ",
                    "የህንጻው የግንባታ ማጠናቀቂያ ሰርተፍኬት",
                    "የግብር ከፋዩ መታወቂያ ፎቶ ኮፒ"
                ],
                leased: [
                    "የተፈጠረውን የማስታወቂያ ደብዳቤ ህትመት (2 ኮፒ)",
                    "ከዋናው አከራይ ጋር የተደረገ የኪራይ ውል ፎቶ ኮፒ",
                    "የዋናው አከራይ የታክስ ከፋይ መለያ ቁጥር (TIN)",
                    "የግብር ከፋዩ መታወቂያ ፎቶ ኮፒ"
                ]
            },
            letterTemplate: {
                greeting: "ለ [AUTHORITY_NAME]",
                subject: "ጉዳዩ፦ አዲስ ለኪራይ ስለቀረበ ቤት ስለማሳወቅ",
                body_built: "እኔ [TAXPAYER_NAME]፣ የታክስ ከፋይ መለያ ቁጥር [TIN] ያለኝ፣ በ [ADDRESS] የሚገኘውን በግሌ ያስገነባሁትን ቤት ለኪራይ አገልግሎት ዝግጁ ማድረጌን በታክስ ህጉ መሰረት ለማሳወቅ እወዳለሁ።",
                body_leased: "እኔ [TAXPAYER_NAME]፣ የታክስ ከፋይ መለያ ቁጥር [TIN] ያለኝ፣ በ [ADDRESS] የሚገኘውን ቤት መልሼ ለማከራየት የተከራየሁ መሆኑንና ለኪራይ አገልግሎት ዝግጁ ማድረጌን በታክስ ህጉ መሰረት ለማሳወቅ እወዳለሁ።",
                closing: "ከታላቅ አክብሮት ጋር፣"
            }
        }
    },
    en: {
        title: "Part Three: Business Income Tax (Schedule C)",
        langButton: "አማርኛ",

        section3_1_Title: "3.1. Taxable Business Income",
        taxableIncomeDef: "Taxable business income is defined as the net income amount remaining after deducting legally allowed expenses from the gross business income earned in the tax year.",
        ifrsBasis: "The determination of taxable business income shall be based on the profit and loss statement or income statement prepared in accordance with International Financial Reporting Standards (IFRS).",
        legalHierarchy: "However, the following shall be observed:",
        laws: [
            "Provisions of the Income Tax Proclamation",
            "The Income Tax Regulation",
            "Directives issued by the Ministry of Finance"
        ],

        section3_2_Title: "3.2. Business Income",
        grossIncomeSources: "Gross business income includes the following:",
        sources: [
            "The monetary amount a taxpayer earns from transferring goods and providing services (excluding employment).",
            "The monetary amount obtained from the disposal of a business asset.",
            "Any other income determined to be the taxpayer's income.",
            "Gain on the disposal of a capital asset that is a business asset."
        ],
        
        interactiveForm: {
            title: "Practical Tool: New Property Declaration Form",
            instructions: "Use this form to notify the authority about a new property available for rent. Fill in the details to see the generated letter.",
            step1: "Step 1: Select Property Status",
            built: "Personally Constructed",
            leased: "Leased to Sub-lease",
            step2: "Step 2: Enter Your Information",
            taxpayerName: "Taxpayer's Full Name",
            tin: "Taxpayer Identification Number (TIN)",
            authorityName: "Relevant Authority (e.g., Kebele Administration)",
            address: "Property's Full Address (Sub-city, Woreda, House No.)",
            step3: "Step 3: Generated Notification Letter",
            copy: "Copy",
            copied: "Copied!",
            step4: "Step 4: Submission Checklist",
            checklist: {
                built: [
                    "Printed copy of the generated notification letter (2 copies)",
                    "Photocopy of the property ownership title deed",
                    "Certificate of completion for the building",
                    "Photocopy of the taxpayer's ID"
                ],
                leased: [
                    "Printed copy of the generated notification letter (2 copies)",
                    "Photocopy of the lease agreement with the primary lessor",
                    "TIN of the primary lessor",
                    "Photocopy of the taxpayer's ID"
                ]
            },
            letterTemplate: {
                greeting: "To: [AUTHORITY_NAME]",
                subject: "Subject: Notification of a New Property Available for Rent",
                body_built: "I, [TAXPAYER_NAME], holder of Taxpayer Identification Number [TIN], would like to notify you, in accordance with the tax law, that the property I have personally constructed at [ADDRESS] is now ready for rental services.",
                body_leased: "I, [TAXPAYER_NAME], holder of Taxpayer Identification Number [TIN], would like to notify you, in accordance with the tax law, that the property I have leased at [ADDRESS] is now ready for sub-leasing rental services.",
                closing: "Sincerely,"
            }
        }
    }
};

// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center mb-3 border-b pb-2">
            <div className="text-gray-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
);

const DeclarationForm = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang].interactiveForm;
    const [status, setStatus] = useState<'built' | 'leased' | null>(null);
    const [formData, setFormData] = useState({ name: '', tin: '', authority: '', address: '' });
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateLetter = () => {
        if (!status) return '';
        const template = t.letterTemplate;
        const body = status === 'built' ? template.body_built : template.body_leased;
        
        return `${template.greeting.replace('[AUTHORITY_NAME]', formData.authority || `(${t.authorityName})`)}
Date: _______________

${template.subject}

${body.replace('[TAXPAYER_NAME]', formData.name || `(${t.taxpayerName})`).replace('[TIN]', formData.tin || `(${t.tin})`).replace('[ADDRESS]', formData.address || `(${t.address})`)}

${template.closing}

_________________________
${formData.name || `(${t.taxpayerName})`}
`;
    };
    
    const letterText = generateLetter();

    const handleCopy = () => {
        navigator.clipboard.writeText(letterText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Section title={t.title} icon={<ScrollText />}>
            <div className="p-3">
                <p className="text-sm text-gray-600 mb-3">{t.instructions}</p>
                {/* Step 1 */}
                <h4 className="font-bold text-lg mb-2">{t.step1}</h4>
                <div className="flex gap-4 mb-4">
                    <button onClick={() => setStatus('built')} className={`flex-1 p-3 border-2 flex items-center justify-center gap-2 ${status === 'built' ? 'bg-blue-600 text-white border-blue-700' : 'hover:bg-blue-100'}`}><Building2 /> {t.built}</button>
                    <button onClick={() => setStatus('leased')} className={`flex-1 p-3 border-2 flex items-center justify-center gap-2 ${status === 'leased' ? 'bg-blue-600 text-white border-blue-700' : 'hover:bg-blue-100'}`}><Handshake /> {t.leased}</button>
                </div>
                
                {status && (
                    <>
                        {/* Step 2 */}
                        <h4 className="font-bold text-lg mb-2">{t.step2}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input name="name" value={formData.name} onChange={handleInputChange} placeholder={t.taxpayerName} className="p-2 border"/>
                            <input name="tin" value={formData.tin} onChange={handleInputChange} placeholder={t.tin} className="p-2 border"/>
                            <input name="authority" value={formData.authority} onChange={handleInputChange} placeholder={t.authorityName} className="p-2 border"/>
                            <input name="address" value={formData.address} onChange={handleInputChange} placeholder={t.address} className="p-2 border"/>
                        </div>
                        
                        {/* Step 3 */}
                        <h4 className="font-bold text-lg mb-2">{t.step3}</h4>
                        <div className="relative mb-4">
                            <textarea value={letterText} readOnly className="w-full h-72 p-4 font-mono text-sm border resize-none" />
                            <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-600 text-white text-xs hover:bg-gray-700">{copied ? t.copied : t.copy}</button>
                        </div>

                        {/* Step 4 */}
                        <h4 className="font-bold text-lg mb-2">{t.step4}</h4>
                        <ul className="space-y-2">
                           {(status === 'built' ? t.checklist.built : t.checklist.leased).map((item, i) => (
                               <li key={i} className="flex items-center p-2"><CheckCircle className="h-5 w-5 mr-3 text-green-500"/>{item}</li>
                           ))}
                        </ul>
                    </>
                )}
            </div>
        </Section>
    );
};

// --- Main Chapter Component ---
export default function BusinessIncomeIntroChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center">
                        <Briefcase className="h-8 w-8 mr-3" />
                        <div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1></div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm">{t.langButton}</button>
                </header>

                <main className="py-4">
                    <Section title={t.section3_1_Title} icon={<Calculator />}>
                        <div className="p-3">
                            <p className="font-semibold">{t.taxableIncomeDef}</p>
                        </div>
                        <div className="mt-4 p-3">
                            <p className="mb-3">{t.ifrsBasis}</p>
                            <div className="p-3">
                                <h4 className="font-bold text-yellow-900 flex items-center"><Scale className="h-5 w-5 mr-2" />{t.legalHierarchy}</h4>
                                <ul className="list-decimal list-inside mt-2 pl-2">
                                    {t.laws.map((law, i) => <li key={i}>{law}</li>)}
                                </ul>
                            </div>
                        </div>
                    </Section>

                    <Section title={t.section3_2_Title} icon={<ListChecks />}>
                        <h3 className="font-semibold">{t.grossIncomeSources}</h3>
                        <ul className="space-y-2">
                            {t.sources.map((source, i) => (
                                <li key={i} className="flex items-start p-2">
                                    <CheckCircle className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0"/>
                                    <span>{source}</span>
                                </li>
                            ))}
                        </ul>
                        <ChapterNavigation previous='/content/686e8e6723afc16ef4f670db' next='/content/686e8e6723afc16ef4f670e1' lang={lang} />
                    </Section>

                    {/* Interactive Form Component */}
                    <DeclarationForm lang={lang} />
                </main>
            </div>
        </div>
    );
}
