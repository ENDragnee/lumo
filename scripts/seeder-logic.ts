// /scripts/seed-static-content.ts

// Step 1: Configure dotenv at the absolute top level.
// This runs BEFORE any other local modules are imported.
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
console.log('[Seeder] Environment variables loaded.');

// We define an async function to hold our logic.
const main = async () => {
  // Step 2: Now that the environment is loaded, we can safely import our modules.
  // These imports will now see the correct `process.env.DATABASE_URL`.
  const mongoose = await import('mongoose');
  const Content = (await import('../src/models/Content')).default;
  const dbConnect = (await import('../src/lib/mongodb')).default;

  // --- DEFINE YOUR STATIC PAGES HERE ---
  const staticPagesToSeed = [
    {
      title: "chapter 1.1: ክፍል አንድ: አጠቃላይ ሁኔታ",
      contentType: 'static',
      data: 'chapter 1/chapter 1.1',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "በታክስ አስተዳደር ህግ መሰረት ስለ ታክስ ከፋይ ምዝገባ እና ስረዛ መወያየት እና መግለጽ።",
      tags: ['mor-ethiopia', 'tax-registration', 'chapter-1'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 1.2: ክፍል ሁለት: ለታክስ ከፋይነት ስለመመዝገብ",
      contentType: 'static',
      data: 'chapter 1/chapter 1.2',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ለታክስ ከፋይነት የመመዝገብ ግዴታ ያለባቸውን ሰዎች እና ማሟላት የሚገባቸውን ቅድመ ሁኔታዎች ይገልጻል።",
      tags: ['mor-ethiopia', 'tax-registration', 'chapter-1'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 1.3: ክፍል ሶስት: ስለታክስ ከፋይ መለያ ቁጥር አሰጣጥ",
      contentType: 'static',
      data: 'chapter 1/chapter 1.3',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ስለታክስ ከፋይ መለያ ቁጥር (TIN) አሰጣጥ፣ አጠቃቀም እና ስረዛ ደንቦችን ያብራራል።",
      tags: ['mor-ethiopia', 'tax-registration', 'tin', 'chapter-1'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 1.4: ምዕራፍ 4: ምዝገባን ስለመሰረዝና ስለ ቅጣቶች",
      contentType: 'static',
      data: 'chapter 1/chapter 1.4',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የታክስ ከፋይነት ምዝገባን ስለመሰረዝ ሂደቶች እና ተያያዥ አስተዳደራዊ እና የወንጀል ቅጣቶችን ይገልጻል።",
      tags: ['mor-ethiopia', 'tax-registration', 'cancellation', 'penalties', 'chapter-1'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.1: ክፍል ሦስት: የንግድ ስራ ገቢ ግብር (ሰንጠረዥ ሐ)",
      contentType: 'static',
      data: 'chapter 2/chapter 2.1',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ግብር የሚከፈልበት የንግድ ስራ ገቢ ምንነት፣ የገቢ ምንጮች፣ የግብር መጣኔዎች እና ተቀናሽ ስለሚደረጉ ወጪዎች አጠቃላይ መግቢያ።",
      tags: ['mor-ethiopia', 'business-tax', 'schedule-c', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.2: የቤት ኪራይ ገቢ ግብር እንዴት እንደሚጣል",
      contentType: 'static',
      data: 'chapter 2/chapter 2.2',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የቤት ኪራይ ገቢ ግብር አጣጣል መርሆዎች፣ የገቢው ምንነት እና ተቀናሽ ስለሚደረጉ ወጪዎች ዝርዝር ማብራሪያ።",
      tags: ['mor-ethiopia', 'rental-tax', 'schedule-b', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.3: ክፍል ሁለት: የቤት ኪራይ ገቢ ግብር (ሠንጠረዥ “ለ“)",
      contentType: 'static',
      data: 'chapter 2/chapter 2.3',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የቤት ኪራይ ገቢ ግብር አጣጣል፣ የገቢ ምንነት፣ ተቀናሽ ወጪዎች እና የግብር መጣኔዎችን በዝርዝር ይዳስሳል።",
      tags: ['mor-ethiopia', 'rental-tax', 'schedule-b', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.4: 2.3. ተቀናሽ የሚደረጉ ወጪዎች",
      contentType: 'static',
      data: 'chapter 2/chapter 2.4',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የሂሳብ መዝገብ ለሚይዙ እና ለማይዙ ግብር ከፋዮች ተቀናሽ ስለሚደረጉ የኪራይ ገቢ ወጪዎች ዝርዝር ህጎች።",
      tags: ['mor-ethiopia', 'rental-tax', 'deductible-expenses', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.5: የኪራይ ገቢ ግብር መጣኔ እና ተዛማጅ ህጎች",
      contentType: 'static',
      data: 'chapter 2/chapter 2.5',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የኪራይ ገቢ ግብር መጣኔ ለግለሰቦች እና ለድርጅቶች፣ እና ከተከራይ አከራዮች፣ ከውጭ ሀገር ገቢ እና ከኪሳራ ማሸጋገር ጋር የተያያዙ ህጎች።",
      tags: ['mor-ethiopia', 'rental-tax', 'tax-rates', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.6: ክፍል ሦስት: የንግድ ስራ ገቢ ግብር (ሰንጠረዥ ሐ)",
      contentType: 'static',
      data: 'chapter 2/chapter 2.6',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ግብር የሚከፈልበት የንግድ ስራ ገቢ ምንነት እና የገቢ ምንጮችን ከህጋዊ የማጣቀሻ ማዕቀፎች ጋር ያብራራል።",
      tags: ['mor-ethiopia', 'business-tax', 'schedule-c', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.7: 3.3. የንግድ ስራ ገቢ ግብር ማስከፈያ መጣኔ",
      contentType: 'static',
      data: 'chapter 2/chapter 2.7',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ለድርጅቶች እና ለግለሰቦች የንግድ ስራ ገቢ ግብር ማስከፈያ መጣኔዎችን ከግብር ማስያ መሳሪያ ጋር ያቀርባል።",
      tags: ['mor-ethiopia', 'business-tax', 'tax-rates', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.8: 3.4. ተቀናሽ የሚደረጉ ወጪዎች",
      contentType: 'static',
      data: 'chapter 2/chapter 2.8',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "አጠቃላይ እና ዝርዝር ተቀናሽ የሚደረጉ የንግድ ስራ ወጪዎችን ከተግባራዊ ልምምዶች ጋር ያብራራል።",
      tags: ['mor-ethiopia', 'business-tax', 'deductible-expenses', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.9: ልዩ ተቀናሽ ወጪዎች: ስጦታ እና የእርጅና ቅናሽ",
      contentType: 'static',
      data: 'chapter 2/chapter 2.9',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ለበጎ አድራጎት ስጦታ እና ለተለያዩ የሀብት አይነቶች የእርጅና ቅናሽ አያያዝን የሚመለከቱ ልዩ ተቀናሽ ወጪዎችን ይዳስሳል።",
      tags: ['mor-ethiopia', 'business-tax', 'donations', 'depreciation', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.10: 3.6. የማስታወቂያ ወጪ",
      contentType: 'static',
      data: 'chapter 2/chapter 2.10',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ተቀናሽ ስለሚደረጉ የማስታወቂያ ወጪዎች እና ገደቦቻቸው ከግብር ማስያ መሳሪያ ጋር ያብራራል።",
      tags: ['mor-ethiopia', 'business-tax', 'advertising-costs', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.11: ልዩ ተቀናሽ ወጪዎች: የምርት ብክነት እና መዝናኛ",
      contentType: 'static',
      data: 'chapter 2/chapter 2.11',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "በተወሰኑ የኢንዱስትሪ ዘርፎች ለሚከሰት የምርት ብክነት እና ለሰራተኞች መዝናኛ የሚወጡ ወጪዎችን አያያዝ ይገልጻል።",
      tags: ['mor-ethiopia', 'business-tax', 'wastage', 'entertainment-cost', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.12: የማይሰበሰብ ዕዳ፣ የኪሳራ ማሸጋገር እና ተቀናሽ የማይሆኑ ወጪዎች",
      contentType: 'static',
      data: 'chapter 2/chapter 2.12',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የማይሰበሰብ ዕዳን፣ ኪሳራን ስለማሸጋገር እና ተቀናሽ ስለማይሆኑ ወጪዎች ዝርዝር ደንቦችን ያብራራል።",
      tags: ['mor-ethiopia', 'business-tax', 'bad-debt', 'loss-carry-forward', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.13: ሁሉን አቀፍ የማጠቃለያ ፈተና",
      contentType: 'static',
      data: 'chapter 2/chapter 2.13',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ከንግድ ስራ እና ከኪራይ ገቢ ግብር ጋር የተያያዙ ርዕሶችን የሚሸፍን ሁሉን አቀፍ የማጠቃለያ ፈተና።",
      tags: ['mor-ethiopia', 'tax-exam', 'assessment', 'chapter-2'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.14: ምዕራፍ አራት: የሂሳብ መዝገብ አያያዝ እና የሂሳብ ዓመት",
      contentType: 'static',
      data: 'chapter 2/chapter 2.14',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ስለ ሂሳብ መዝገብ አያያዝ ግዴታ፣ ስለሚያስፈልጉ ሰነዶች እና ስለተለያዩ የመዝገብ አይነቶች ዝርዝር መረጃ ይሰጣል።",
      tags: ['mor-ethiopia', 'bookkeeping', 'fiscal-year', 'chapter-2'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.15: የታክስ መግለጫ ማስተካከያ፣ ውድቅ ማድረግ እና ልዩ ደንቦች",
      contentType: 'static',
      data: 'chapter 2/chapter 2.15',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የታክስ መግለጫ ስለሚስተካከልባቸው እና ውድቅ ስለሚደረግባቸው ሁኔታዎች እንዲሁም ከውጭ ምንዛሬ እና ከብድር ጋር የተያያዙ ልዩ ደንቦችን ያብራራል።",
      tags: ['mor-ethiopia', 'tax-declaration', 'audit', 'chapter-2'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.16: ምዕራፍ አምስት: የድርጅት ቁጥጥር ለውጥ፣ መልሶ ማደራጀት እና የማዕድን ግብር",
      contentType: 'static',
      data: 'chapter 2/chapter 2.16',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ስለ ድርጅት ቁጥጥር ለውጥ፣ መልሶ ማደራጀት እና ለማዕድንና ነዳጅ ስራዎች ስለሚተገበሩ ልዩ የግብር ህጎች ያብራራል።",
      tags: ['mor-ethiopia', 'corporate-tax', 'reorganization', 'mining-tax', 'chapter-2'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.17: ዓለም አቀፍ ግብር፣ ስምምነቶች እና ልዩ የአሰራር ደንቦች",
      contentType: 'static',
      data: 'chapter 2/chapter 2.17',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ከዓለም አቀፍ ግብር፣ ከግብር ስምምነቶች፣ ከምንዛሬ ልወጣ እና ከግብር መሸሽ መከላከያ ጋር የተያያዙ ደንቦችን ይዳስሳል።",
      tags: ['mor-ethiopia', 'international-tax', 'tax-treaties', 'chapter-2'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 2.18: ሁሉን አቀፍ የማጠቃለያ ፈተና",
      contentType: 'static',
      data: 'chapter 2/chapter 2.18',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ከሂሳብ አያያዝ፣ ከዓለም አቀፍ ግብር እና ከልዩ ደንቦች ጋር የተያያዙ ርዕሶችን የሚሸፍን ሁሉን አቀፍ የማጠቃለያ ፈተና።",
      tags: ['mor-ethiopia', 'tax-exam', 'assessment', 'chapter-2'],
      difficulty: 'hard' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.1: ሞጁል ሦስት: ከተከፋይ ሂሳቦች ላይ ታክስ ቀንሶ የማስቀረት ሥርዓት",
      contentType: 'static',
      data: 'chapter 3/chapter 3.1',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ከተከፋይ ሂሳብ ላይ ግብር ቀንሶ ስለማስቀረት ያለውን መሠረታዊ የህግ ድንጋጌዎችና አስተዳደራዊ ሥነ-ስርዓቶች ላይ ግንዛቤ ለመፍጠር ያለመ።",
      tags: ['mor-ethiopia', 'withholding-tax', 'chapter-3'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.2: ከተከፋይ ሂሳቦች ላይ ግብር ቀንሶ ስለማስቀረት ዝርዝር ደንቦች",
      contentType: 'static',
      data: 'chapter 3/chapter 3.2',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ለተለያዩ የገቢ አይነቶች (ቅጥር፣ ነዋሪ ላልሆኑ ክፍያዎች፣ የካፒታል ጥቅም፣ ያልተከፋፈለ ትርፍ) የሚተገበሩትን የቅድሚያ ግብር መጣኔዎች እና ደንቦች ያብራራል።",
      tags: ['mor-ethiopia', 'withholding-tax', 'tax-rates', 'chapter-3'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.3: ክፍል ሦስት: የንግድ ስራ ገቢ ግብር (ሰንጠረዥ ሐ)",
      contentType: 'static',
      data: 'chapter 3/chapter 3.3',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ግብር የሚከፈልበት የንግድ ስራ ገቢ ምንነት እና የገቢ ምንጮችን ከህጋዊ የማጣቀሻ ማዕቀፎች ጋር ያብራራል።",
      tags: ['mor-ethiopia', 'business-tax', 'schedule-c', 'chapter-3'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.4: ክፍል ሦስት: ቅድመ ታክስ (Withholding Tax)",
      contentType: 'static',
      data: 'chapter 3/chapter 3.4',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "የቅድሚያ ታክስን ዓላማ እና ወደ አገር ውስጥ በሚገቡ ዕቃዎች ላይ እንዴት እንደሚሰላ በምሳሌ ያስረዳል።",
      tags: ['mor-ethiopia', 'withholding-tax', 'imports', 'chapter-3'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.5: ልዩ የግብር አያያዝ እና ግብር ቀንሶ የማስቀረት ግዴታ ያለባቸው አካላት",
      contentType: 'static',
      data: 'chapter 3/chapter 3.5',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ለጥገና እና ለኮንስትራክሽን አገልግሎቶች ልዩ የቅድሚያ ግብር አያያዝን እና ግብር ቀንሶ የማስቀረት ግዴታ ያለባቸውን አካላት ይለያል።",
      tags: ['mor-ethiopia', 'withholding-tax', 'construction', 'repair', 'chapter-3'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.6: ግብር ቀንሶ የማስቀረት ግዴታ ያለባቸው ግለሰቦች፣ ነጻ የሆኑ ግብይቶች እና የውክልና ሀላፊነቶች",
      contentType: 'static',
      data: 'chapter 3/chapter 3.6',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "በግለሰብ ደረጃ ግብር ቀንሶ የማስቀረት ግዴታ ያለባቸውን፣ ከቅድሚያ ግብር ነጻ የሆኑ ግብይቶችን እና የወኪልነት ሀላፊነቶችን ይዘረዝራል።",
      tags: ['mor-ethiopia', 'withholding-tax', 'exemptions', 'agents', 'chapter-3'],
      difficulty: 'medium' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    },
    {
      title: "chapter 3.7: withholding tax እና ተያያዥ ጉዳዮች ፈተና",
      contentType: 'static',
      data: 'chapter 3/chapter 3.7',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "ከቅድሚያ ግብር (withholding tax) ጋር የተያያዙ ርዕሶችን የሚሸፍን ሁሉን አቀፍ የማጠቃለያ ፈተና።",
      tags: ['mor-ethiopia', 'tax-exam', 'withholding-tax', 'assessment', 'chapter-3'],
      difficulty: 'hard' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'),
      institutionId: new mongoose.Types.ObjectId('6868ff83f4d25983b416bb56'),
    }
  ];

  console.log('[Seeder] Connecting to database...');
  await dbConnect();
  console.log('[Seeder] Database connected. Starting to seed static content...');

  let createdCount = 0;
  let skippedCount = 0;

  try {
    for (const pageData of staticPagesToSeed) {
      const existingContent = await Content.findOne({
        contentType: 'static',
        data: pageData.data,
      });

      if (existingContent) {
        console.log(`- Skipping: Content with key "${pageData.data}" already exists.`);
        skippedCount++;
      } else {
        console.log(`+ Creating: Content for "${pageData.title}"...`);
        // We need to cast the partial type to the full type for the model
        const newContent = new Content(pageData);
        await newContent.save();
        createdCount++;
      }
    }
  } catch (error) {
    console.error('❌ An error occurred during seeding:', error);
    // Disconnect on error
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('\n--- Seeding Complete ---');
  console.log(`✅ Successfully created ${createdCount} new documents.`);
  console.log(`⏭️ Skipped ${skippedCount} existing documents.`);
  
  // IMPORTANT: Disconnect from the database to allow the script to exit.
  await mongoose.disconnect();
  console.log('[Seeder] Database connection closed.');
  process.exit(0); // Exit successfully
};

// Step 3: Call the main function to run the script.
main();
