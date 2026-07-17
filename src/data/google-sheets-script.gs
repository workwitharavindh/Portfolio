/**
 * Google Sheets API Backend for Aravindhan R Portfolio
 * 
 * Instructions:
 * 1. Create a Google Sheet.
 * 2. Click Extensions -> Apps Script.
 * 3. Replace all default code with this script.
 * 4. Save and click "Deploy" -> "New deployment".
 * 5. Choose Type: "Web app".
 * 6. Set "Execute as": "Me" (your-email).
 * 7. Set "Who has access": "Anyone".
 * 8. Click Deploy, authorize permissions, and copy the Web App URL.
 * 9. Paste the URL into .env.local as SHEETS_WEBAPP_URL.
 */

var DEFAULT_SETTINGS = {
  aboutImageUrl: "/assets/images/profile.png",
  email: "aravindhanaravi105@gmail.com",
  whatsapp: "+919994427630",
  instagram: "https://www.instagram.com/__aravindhan?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  linkedin: "https://www.linkedin.com/in/arasukirubanandhan/"
};

var DEFAULT_PROJECTS = [
  {
    id: "item-2",
    title: "Wedding Cinema Test",
    category: "Wedding Films",
    videoUrl: "https://youtu.be/iAtoZar5W58?si=rfukHd9SYq5slNl0",
    thumbnailUrl: "",
    layout: "Vertical",
    isFeatured: "false"
  },
  {
    id: "item-3",
    title: "Street Style Virality",
    category: "Viral Content",
    videoUrl: "https://youtu.be/Aze7zTyIRtk?si=NT8PG9a7vjOn7F1w",
    thumbnailUrl: "",
    layout: "Horizontal",
    isFeatured: "false"
  },
  {
    id: "item-4",
    title: "Epic Mountain Showreel",
    category: "Featured Work",
    videoUrl: "https://youtu.be/YQ6ShcAU_dQ?si=Xcv4sn8QwqgqfadQ",
    thumbnailUrl: "",
    layout: "Horizontal",
    isFeatured: "false"
  },
  {
    id: "item-5",
    title: "Fast & Furious Car Sequence",
    category: "Reels",
    videoUrl: "https://youtu.be/b68HETiNO98?si=JH3mYEmDz7SV26L4",
    thumbnailUrl: "",
    layout: "Horizontal",
    isFeatured: "false"
  },
  {
    id: "item-6",
    title: "Cinematic Drone Journey",
    category: "YouTube Content",
    videoUrl: "https://youtu.be/4bZ-MAOLbGc?si=zB27r8xM4nY3Oal8",
    thumbnailUrl: "",
    layout: "Horizontal",
    isFeatured: "false"
  }
];

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Ensure sheets exist and are initialized with default columns and rows if empty
  initSheets(ss);
  
  if (action === "get") {
    var data = getConfiguration(ss);
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action. Use ?action=get to retrieve data." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  initSheets(ss);
  
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing POST payload contents.");
    }
    var postData = JSON.parse(e.postData.contents);
    saveConfiguration(ss, postData);
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Settings saved successfully." }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function initSheets(ss) {
  // 1. Settings Sheet (Stores general details)
  var settingsSheet = ss.getSheetByName("Settings");
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet("Settings");
    settingsSheet.appendRow(["Key", "Value"]);
  }
  
  var settingsRows = settingsSheet.getLastRow();
  if (settingsRows <= 1) {
    settingsSheet.appendRow(["aboutImageUrl", DEFAULT_SETTINGS.aboutImageUrl]);
    settingsSheet.appendRow(["email", DEFAULT_SETTINGS.email]);
    settingsSheet.appendRow(["whatsapp", DEFAULT_SETTINGS.whatsapp]);
    settingsSheet.appendRow(["instagram", DEFAULT_SETTINGS.instagram]);
    settingsSheet.appendRow(["linkedin", DEFAULT_SETTINGS.linkedin]);
    settingsSheet.appendRow(["youtube", ""]);
  }
  
  // 2. Projects Sheet (Stores portfolio project records)
  var projectsSheet = ss.getSheetByName("Projects");
  if (!projectsSheet) {
    projectsSheet = ss.insertSheet("Projects");
    projectsSheet.appendRow(["ID", "Title", "Category", "VideoUrl", "ThumbnailUrl", "Layout", "IsFeatured", "Subcategory"]);
  } else {
    // Check if headers are outdated (migrate from old description field to layout field)
    var lastCol = projectsSheet.getLastColumn();
    if (lastCol >= 8) {
      var headers = projectsSheet.getRange(1, 1, 1, 8).getValues()[0];
      if (headers[5] !== "Layout" || headers[6] !== "IsFeatured" || headers[7] !== "Subcategory") {
        projectsSheet.getRange(1, 1, 1, 8).setValues([["ID", "Title", "Category", "VideoUrl", "ThumbnailUrl", "Layout", "IsFeatured", "Subcategory"]]);
        // Mismatched columns! Clear data rows so they can be re-populated correctly on next save
        var lastRow = projectsSheet.getLastRow();
        if (lastRow > 1) {
          projectsSheet.deleteRows(2, lastRow - 1);
        }
      }
    } else {
      // Mismatched column count! Force correct headers
      projectsSheet.getRange(1, 1, 1, 8).setValues([["ID", "Title", "Category", "VideoUrl", "ThumbnailUrl", "Layout", "IsFeatured", "Subcategory"]]);
      var lastRow = projectsSheet.getLastRow();
      if (lastRow > 1) {
        projectsSheet.deleteRows(2, lastRow - 1);
      }
    }
  }
  
  var projectsRows = projectsSheet.getLastRow();
  if (projectsRows <= 1) {
    for (var i = 0; i < DEFAULT_PROJECTS.length; i++) {
      var p = DEFAULT_PROJECTS[i];
      projectsSheet.appendRow([
        p.id,
        p.title,
        p.category,
        p.videoUrl,
        p.thumbnailUrl,
        p.layout,
        p.isFeatured,
        ""
      ]);
    }
  }

  // 3. Categories Sheet (Stores video categories)
  var categoriesSheet = ss.getSheetByName("Categories");
  if (!categoriesSheet) {
    categoriesSheet = ss.insertSheet("Categories");
    categoriesSheet.appendRow(["Category"]);
    var defaultCats = ["Commercial Projects", "YouTube Content", "Reels", "Wedding Films"];
    for (var k = 0; k < defaultCats.length; k++) {
      categoriesSheet.appendRow([defaultCats[k]]);
    }
  }

  // 4. Subcategories Sheet (Stores video subcategories)
  var subcategoriesSheet = ss.getSheetByName("Subcategories");
  if (!subcategoriesSheet) {
    subcategoriesSheet = ss.insertSheet("Subcategories");
    subcategoriesSheet.appendRow(["Category", "Subcategory"]);
    var defaultSubcats = [
      ["Reels", "Food"],
      ["Reels", "Fashion"]
    ];
    for (var m = 0; m < defaultSubcats.length; m++) {
      subcategoriesSheet.appendRow(defaultSubcats[m]);
    }
  }
  
  // Remove default "Sheet1" if it is present and empty
  var sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1 && sheet1.getLastRow() === 0) {
    ss.deleteSheet(sheet1);
  }
}

function getConfiguration(ss) {
  var settingsSheet = ss.getSheetByName("Settings");
  var settingsData = settingsSheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < settingsData.length; i++) {
    var key = settingsData[i][0];
    var val = settingsData[i][1];
    settings[key] = val;
  }
  
  var projectsSheet = ss.getSheetByName("Projects");
  var projectsData = projectsSheet.getDataRange().getValues();
  var portfolioItems = [];
  for (var j = 1; j < projectsData.length; j++) {
    portfolioItems.push({
      id: projectsData[j][0].toString(),
      title: projectsData[j][1].toString(),
      category: projectsData[j][2].toString(),
      videoUrl: projectsData[j][3].toString(),
      thumbnailUrl: projectsData[j][4].toString(),
      layout: projectsData[j][5] ? projectsData[j][5].toString() : "Horizontal",
      isFeatured: projectsData[j][6] === true || projectsData[j][6].toString().toLowerCase() === "true",
      subcategory: projectsData[j][7] ? projectsData[j][7].toString() : ""
    });
  }

  var categoriesSheet = ss.getSheetByName("Categories");
  var categories = [];
  if (categoriesSheet) {
    var categoriesData = categoriesSheet.getDataRange().getValues();
    for (var k = 1; k < categoriesData.length; k++) {
      if (categoriesData[k][0]) {
        categories.push(categoriesData[k][0].toString());
      }
    }
  }

  var subcategoriesSheet = ss.getSheetByName("Subcategories");
  var subcategories = [];
  if (subcategoriesSheet) {
    var subcategoriesData = subcategoriesSheet.getDataRange().getValues();
    for (var m = 1; m < subcategoriesData.length; m++) {
      if (subcategoriesData[m][0] && subcategoriesData[m][1]) {
        subcategories.push({
          category: subcategoriesData[m][0].toString(),
          name: subcategoriesData[m][1].toString()
        });
      }
    }
  }
  
  return {
    aboutImageUrl: settings.aboutImageUrl || "",
    contactDetails: {
      email: settings.email || "",
      whatsapp: settings.whatsapp || "",
      instagram: settings.instagram || "",
      linkedin: settings.linkedin || "",
      youtube: settings.youtube || ""
    },
    categories: categories.length > 0 ? categories : undefined,
    subcategories: subcategories,
    portfolioItems: portfolioItems
  };
}

function saveConfiguration(ss, data) {
  if (!data) return;
  
  // 1. Save Settings key-value pairs
  var settingsSheet = ss.getSheetByName("Settings");
  var settingsMap = {};
  if (data.aboutImageUrl !== undefined) settingsMap["aboutImageUrl"] = data.aboutImageUrl;
  if (data.contactDetails) {
    if (data.contactDetails.email !== undefined) settingsMap["email"] = data.contactDetails.email;
    if (data.contactDetails.whatsapp !== undefined) settingsMap["whatsapp"] = data.contactDetails.whatsapp;
    if (data.contactDetails.instagram !== undefined) settingsMap["instagram"] = data.contactDetails.instagram;
    if (data.contactDetails.linkedin !== undefined) settingsMap["linkedin"] = data.contactDetails.linkedin;
    if (data.contactDetails.youtube !== undefined) settingsMap["youtube"] = data.contactDetails.youtube;
  }
  
  var settingsRows = settingsSheet.getDataRange().getValues();
  for (var i = 1; i < settingsRows.length; i++) {
    var key = settingsRows[i][0];
    if (settingsMap[key] !== undefined) {
      settingsSheet.getRange(i + 1, 2).setValue(settingsMap[key]);
      delete settingsMap[key]; // mark updated
    }
  }
  
  // Append new settings if they were not in the sheet originally
  for (var key in settingsMap) {
    settingsSheet.appendRow([key, settingsMap[key]]);
  }

  // 2. Save Categories
  var categoriesSheet = ss.getSheetByName("Categories");
  if (categoriesSheet && data.categories && Array.isArray(data.categories)) {
    var lastCatRow = categoriesSheet.getLastRow();
    if (lastCatRow > 1) {
      categoriesSheet.deleteRows(2, lastCatRow - 1);
    }
    for (var k = 0; k < data.categories.length; k++) {
      if (data.categories[k]) {
        categoriesSheet.appendRow([data.categories[k]]);
      }
    }
  }

  // 3. Save Subcategories
  var subcategoriesSheet = ss.getSheetByName("Subcategories");
  if (subcategoriesSheet && data.subcategories && Array.isArray(data.subcategories)) {
    var lastSubcatRow = subcategoriesSheet.getLastRow();
    if (lastSubcatRow > 1) {
      subcategoriesSheet.deleteRows(2, lastSubcatRow - 1);
    }
    for (var m = 0; m < data.subcategories.length; m++) {
      var sub = data.subcategories[m];
      if (sub && sub.category && sub.name) {
        subcategoriesSheet.appendRow([sub.category, sub.name]);
      }
    }
  }
  
  // 4. Save Portfolio items - Clear and rewrite to maintain index order
  var projectsSheet = ss.getSheetByName("Projects");
  if (data.portfolioItems && Array.isArray(data.portfolioItems)) {
    var lastRow = projectsSheet.getLastRow();
    if (lastRow > 1) {
      projectsSheet.deleteRows(2, lastRow - 1);
    }
    for (var j = 0; j < data.portfolioItems.length; j++) {
      var item = data.portfolioItems[j];
      var thumb = item.thumbnailUrl || "";
      var vidUrl = item.videoUrl || "";
      
      // Auto-fetch thumbnail if empty
      if (!thumb) {
        var autoThumb = "";
        var ytMatch = vidUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        var driveMatch = vidUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        
        if (ytMatch && ytMatch[1]) {
          autoThumb = "https://img.youtube.com/vi/" + ytMatch[1] + "/maxresdefault.jpg";
        } else if (driveMatch && driveMatch[1]) {
          autoThumb = "https://drive.google.com/thumbnail?id=" + driveMatch[1] + "&sz=w800";
        }
        
        thumb = autoThumb || "";
      }

      projectsSheet.appendRow([
        item.id || "item-" + (j + 2),
        item.title || "",
        item.category || "",
        vidUrl,
        thumb,
        item.layout || "Horizontal",
        item.isFeatured !== undefined ? item.isFeatured.toString() : "false",
        item.subcategory || ""
      ]);
    }
  }
}
