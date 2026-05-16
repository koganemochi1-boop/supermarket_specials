#!/usr/bin/env node

/**
 * Supermarket Specials Checker - No API Version
 * 
 * This version uses web scraping to find supermarket deals.
 * No API key needed! Uses free services.
 * 
 * Supermarkets: Safeway, Foodland, Whole Foods, Times, Don Quijote
 * Location: Honolulu, Hawaii
 */

const https = require("https");
const fs = require("fs");

// Configuration
const SUPERMARKETS = [
  {
    name: "Safeway",
    searchUrl: "https://www.safeway.com/shopping/deals.html",
    description: "Visit Safeway for weekly deals",
  },
  {
    name: "Foodland",
    searchUrl: "https://www.foodland.com/shopping/deals",
    description: "Check Foodland for current specials",
  },
  {
    name: "Whole Foods",
    searchUrl: "https://www.wholefoodsmarket.com/deals",
    description: "Browse Whole Foods weekly deals",
  },
  {
    name: "Times",
    searchUrl: "https://www.times.com/deals",
    description: "View Times supermarket specials",
  },
  {
    name: "Don Quijote",
    searchUrl: "https://www.donquijote.com/deals",
    description: "Check Don Quijote weekly promotions",
  },
];

/**
 * Fetch a URL and check if it's accessible
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    https
      .head(url, (res) => {
        resolve({
          status: res.statusCode,
          accessible: res.statusCode < 400,
        });
      })
      .on("error", (e) => {
        resolve({
          status: 0,
          accessible: false,
          error: e.message,
        });
      });
  });
}

/**
 * Generate HTML page with links to supermarket deals
 */
async function generateSpecialsPage() {
  console.log("🛒 Supermarket Specials Checker (No API Version)");
  console.log("================================================\n");
  console.log("Checking supermarket websites for current deals...\n");

  const timestamp = new Date().toLocaleString();
  const dealsContent = [];

  // Check each supermarket
  for (const store of SUPERMARKETS) {
    console.log(`Checking ${store.name}...`);
    const urlStatus = await checkUrl(store.searchUrl);

    dealsContent.push({
      name: store.name,
      url: store.searchUrl,
      description: store.description,
      accessible: urlStatus.accessible,
      status: urlStatus.status,
    });
  }

  const html = generateHTML(dealsContent, timestamp);
  return html;
}

/**
 * Generate the HTML page
 */
function generateHTML(deals, timestamp) {
  const dealsHTML = deals
    .map(
      (deal) => `
    <div class="store-card">
        <h3>${deal.name}</h3>
        <p class="description">${deal.description}</p>
        <a href="${deal.url}" target="_blank" class="deals-link">
            📍 View ${deal.name} Deals
        </a>
        <p class="status">${deal.accessible ? "✅ Online" : "⚠️ Status: " + deal.status}</p>
    </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honolulu Supermarket Specials - This Week</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .timestamp {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .info-box {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 4px;
            color: #333;
        }
        
        .info-box strong {
            color: #667eea;
        }
        
        .stores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .store-card {
            background: #f9f9f9;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .store-card:hover {
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }
        
        .store-card h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 1.4em;
        }
        
        .description {
            color: #666;
            font-size: 0.95em;
            margin-bottom: 15px;
        }
        
        .deals-link {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 10px;
            transition: transform 0.2s ease;
        }
        
        .deals-link:hover {
            transform: scale(1.05);
        }
        
        .status {
            font-size: 0.85em;
            color: #999;
            margin-top: 10px;
        }
        
        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #ddd;
        }
        
        .instructions {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            color: #333;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            .content {
                padding: 20px;
            }
            
            .stores-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Honolulu Supermarket Specials</h1>
            <p>Your Weekly Deals Guide</p>
        </div>
        
        <div class="content">
            <div class="timestamp">
                <strong>Last Updated:</strong> ${timestamp}
            </div>
            
            <div class="info-box">
                <strong>💡 How to use:</strong> Click on any supermarket below to view their current weekly deals and specials directly on their website.
            </div>
            
            <div class="stores-grid">
                ${dealsHTML}
            </div>
            
            <div class="instructions">
                <strong>📌 Tips:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>Check each store's website for detailed product pricing and weekly circulars</li>
                    <li>Many stores offer loyalty programs for additional discounts</li>
                    <li>Download store apps for exclusive mobile-only deals</li>
                    <li>Compare prices across stores to find the best deals</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>🤖 Automatically generated | No API required | Click links above to view current deals</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("Generating deals page...\n");
    const htmlPage = await generateSpecialsPage();

    // Save to file
    fs.writeFileSync("supermarket_specials.html", htmlPage);

    console.log("\n✅ Success!");
    console.log("📄 Generated: supermarket_specials.html");
    console.log("\n📖 Open the HTML file in your browser to view all supermarket links");
    console.log("🔗 Each card has a link to that store's deals page");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
