#!/usr/bin/env node

/**
 * Script to populate hero images for all islands in the database
 * Uses a pool of uploaded S3 images and distributes them across all islands
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../drizzle/schema';

// Pool of high-quality Maldivian island images uploaded to S3
const heroImages = [
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/IVZqQcaaIAYSmcAO.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/fYznkSiTbELHPgqu.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ZoAuybSRkanhllxC.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/xcUZRWGJusGFNKeP.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/UPQbAbLNQHkXPcJk.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PjZFyVgIOPftZlnf.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/kFoMcdxVrcOqZXMV.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NLbEzNBgEZGwAACl.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/hNCtTEalPzlZgKbq.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/jVOWljzPhRUViIsL.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/hUdSBYdbwHTAczOJ.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NcMdyeyGizsvfBiy.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/DWdOLSCbuSsUseWr.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/jGMMBjIZDZTYqWdr.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vfJbjeHvzcEOccfl.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/tfaWBxAVEXGTwSZw.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/jOyxRLqragBGCSaT.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/iBOLaiTJKMOFqNIt.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/GxCHDUrQPJxJQpiC.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ldpQszTURzrOxPdy.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/BwGrlAZJtdINJnNB.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FvOPjsZolIIpqsJJ.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FeYUPFCgasAsnOuk.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vwPwVKzWiSgzFnJF.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NPwfhTMoMcFMPwqa.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/OzmRQSeTYXIKMoNJ.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/CghvgbQNicEvehue.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/EmJWVaPNcqUApPYW.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/KfpntUeYxrQfvDpM.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/vlCAjvpWXleGGnxL.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/AzPaAwYSphaqLazC.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/wjrjMGZRJAczySdT.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/bFRVAEQMmhdxQvLI.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PaHGOhIgDUKRtgtd.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/RyARSzqheYchSmjP.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/uSCcMFGWUCncMLxv.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/XZrcKZsiUuGFiEeK.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/KZQgpoMJuiRugvqg.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/bkYsjHlZrROsfJWg.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/MkEPUqTKrBQyTVEg.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/cDOzrlCHLEeOrEwS.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/sYleSFGMcYgCvsxk.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/pTenSgkgpmCURBIg.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/JrDtuFNPQlfumzMP.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/xLHxjPFNtFxpxZDF.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NSpLCDzJyWdFyFVu.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/hfPEnpZlRPIvfyRs.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FnAmswSuBgYtXGAK.jpeg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/aMrxpwXaZxYMGfBQ.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/aYaQeSAXJKuRaJQt.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/gdNskGtLIpxDMffB.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/nzdSemKXBWQRxtod.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/KMHarIiZbeIRJVqn.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/qLninRdcHLGhtNJd.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/QXpGkfNgbDZoaGCG.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ZCGqxOwVIKotuQTW.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/EppJUpCQbrOUEuqr.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/SZMYvWZVxeElpNZj.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/RvmoYxmtJiHwHHTo.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/RfJFfhtYicmbeLlR.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/wjssInKpgojscuJx.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/XSDVhzztPDmsZTuy.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/CXLtgGsCIdbrmJQL.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/QxPOXkxWjaPKRrif.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/MIKmoTPZXFyeMvOb.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/MHSaBGsOZHiRafGj.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/rmigliDowGLEWAZw.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/dlsoqoiMoPiYudG.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/FrAxrvHlmDEbNwmn.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/iFwQyZgGGtcGiJcj.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/UbIJZyvJUljhozfP.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/ZniThGpmPCLLDVtl.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/JAwANgZqCqETuEpn.jpg",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/fzGnUvkaAWhbVcmz.jpg"
];

async function populateHeroImages() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  try {
    // Get all island guides that need hero images
    const guides = await db
      .select()
      .from(schema.islandGuides)
      .where((col) => sql`${col.heroImage} IS NULL OR ${col.heroImage} = ''`);

    console.log(`Found ${guides.length} island guides without hero images`);

    if (guides.length === 0) {
      console.log('✅ All guides already have hero images!');
      process.exit(0);
    }

    // Assign images to guides, cycling through the image pool
    let updated = 0;
    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];
      const imageIndex = i % heroImages.length;
      const heroImageUrl = heroImages[imageIndex];

      await db
        .update(schema.islandGuides)
        .set({ heroImage: heroImageUrl })
        .where(eq(schema.islandGuides.id, guide.id));

      updated++;
      if (updated % 10 === 0) {
        console.log(`✓ Updated ${updated}/${guides.length} guides...`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} island guides with hero images!`);

    // Verify the updates
    const result = await db
      .select({ count: sql`COUNT(*)` })
      .from(schema.islandGuides)
      .where((col) => sql`${col.heroImage} IS NOT NULL AND ${col.heroImage} != ''`);

    console.log(`Total guides with hero images: ${result[0]?.count || 0}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating hero images:', error);
    process.exit(1);
  }
}

populateHeroImages();
