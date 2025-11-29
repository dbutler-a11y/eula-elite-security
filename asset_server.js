const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8081;

// Serve static files from the Visual Assets directory
app.use('/assets', express.static(path.join(__dirname, '03_Visual_Assets')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Dynamic asset discovery function
function getAssetData() {
  const assetsPath = path.join(__dirname, '03_Visual_Assets');
  const assets = [];
  
  if (fs.existsSync(assetsPath)) {
    const scanDirectory = (dirPath, category) => {
      const items = fs.readdirSync(dirPath);
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath, category);
        } else if (/\.(png|jpg|jpeg|gif|svg)$/i.test(item)) {
          const relativePath = path.relative(assetsPath, itemPath);
          const webPath = `/assets/${relativePath.replace(/\\/g, '/')}`;
          const fileName = path.basename(item, path.extname(item));
          const fileExt = path.extname(item).toUpperCase().substring(1);
          
          // Determine asset category and metadata
          let assetCategory = 'other';
          let assetMeta = `${fileExt} • Asset`;
          
          if (relativePath.includes('Character_Images')) {
            assetCategory = 'character';
            if (fileName.includes('flagship') || fileName.includes('hero')) {
              assetMeta = `${fileExt} • Character Image • Flagship Hero`;
            } else if (fileName.includes('front')) {
              assetMeta = `${fileExt} • Character Image • Professional Pose`;
            } else if (fileName.includes('profile')) {
              assetMeta = `${fileExt} • Character Image • Side Profile`;
            } else {
              assetMeta = `${fileExt} • Character Image`;
            }
          } else if (relativePath.includes('Scene_Images')) {
            assetCategory = 'scenes';
            if (relativePath.includes('VIP_Venues')) {
              assetMeta = `${fileExt} • VIP Venue • Houston Landmark`;
            } else if (relativePath.includes('Luxury_Vehicles')) {
              assetMeta = `${fileExt} • Luxury Vehicle • Premium Fleet`;
            } else {
              assetMeta = `${fileExt} • Scene Image`;
            }
          } else if (relativePath.includes('Logos')) {
            assetCategory = 'logos';
            assetMeta = `${fileExt} • Logo`;
          } else if (relativePath.includes('Brand')) {
            assetCategory = 'brand';
            assetMeta = `${fileExt} • Brand Element`;
          }
          
          // Format display name
          const displayName = fileName
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          assets.push({
            name: displayName,
            category: assetCategory,
            webPath,
            fileName: item,
            meta: assetMeta,
            size: stat.size,
            modified: stat.mtime
          });
        }
      });
    };
    
    scanDirectory(assetsPath, '');
  }
  
  return assets;
}

// Asset management interface
app.get('/', (req, res) => {
  const assets = getAssetData();
  const categoryCounts = assets.reduce((counts, asset) => {
    counts[asset.category] = (counts[asset.category] || 0) + 1;
    counts.total = (counts.total || 0) + 1;
    return counts;
  }, {});
  
  const assetCards = assets.map(asset => `
    <div class="asset-card" data-category="${asset.category}">
        <img src="${asset.webPath}" 
             alt="${asset.name}" class="asset-image" style="height: 200px; object-fit: cover;">
        <div class="asset-info">
            <div class="asset-name">${asset.name}</div>
            <div class="asset-meta">${asset.meta}</div>
            <div class="asset-actions">
                <button class="btn btn-primary" onclick="downloadAsset('${asset.webPath}', '${asset.fileName}')">Download</button>
                <button class="btn btn-secondary" onclick="viewFullSize('${asset.webPath}')">View</button>
            </div>
        </div>
    </div>
  `).join('');
  
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eula Elite Security - Brand Asset Manager</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0A0A0A;
            color: #E5E5E5;
            line-height: 1.6;
        }
        
        .header {
            background: linear-gradient(135deg, #0A0A0A 0%, #1B2631 100%);
            padding: 2rem 0;
            border-bottom: 2px solid #D4AF37;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        h1 {
            color: #D4AF37;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            color: #E5E5E5;
            font-size: 1.2rem;
            opacity: 0.8;
        }
        
        .nav-tabs {
            background: #1B2631;
            padding: 1rem 0;
            margin-bottom: 2rem;
        }
        
        .tabs {
            display: flex;
            gap: 1rem;
            overflow-x: auto;
        }
        
        .tab {
            padding: 0.75rem 1.5rem;
            background: transparent;
            color: #E5E5E5;
            border: 1px solid #2C3E50;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .tab:hover, .tab.active {
            background: #D4AF37;
            color: #0A0A0A;
            border-color: #D4AF37;
        }
        
        .asset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .asset-card {
            background: #1B2631;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #2C3E50;
            transition: all 0.3s ease;
        }
        
        .asset-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
            border-color: #D4AF37;
        }
        
        .asset-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #2C3E50;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #E5E5E5;
        }
        
        .asset-info {
            padding: 1.5rem;
        }
        
        .asset-name {
            color: #D4AF37;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .asset-meta {
            color: #E5E5E5;
            opacity: 0.7;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .asset-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #D4AF37;
            color: #0A0A0A;
        }
        
        .btn-secondary {
            background: transparent;
            color: #D4AF37;
            border: 1px solid #D4AF37;
        }
        
        .btn:hover {
            transform: translateY(-1px);
        }
        
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            opacity: 0.6;
        }
        
        .upload-zone {
            border: 2px dashed #D4AF37;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
        }
        
        .upload-zone:hover {
            background: rgba(212, 175, 55, 0.05);
        }
        
        .stats-bar {
            background: #1B2631;
            padding: 1rem 2rem;
            margin-bottom: 2rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #D4AF37;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .asset-grid {
                grid-template-columns: 1fr;
            }
            
            .stats-bar {
                flex-direction: column;
                gap: 1rem;
            }
            
            .tabs {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>Eula Elite Security & Transport</h1>
            <p class="subtitle">Brand Asset Management System</p>
        </div>
    </div>
    
    <div class="nav-tabs">
        <div class="container">
            <div class="tabs">
                <button class="tab active" onclick="showCategory('all')">All Assets</button>
                <button class="tab" onclick="showCategory('character')">Character Images</button>
                <button class="tab" onclick="showCategory('logos')">Logos</button>
                <button class="tab" onclick="showCategory('brand')">Brand Elements</button>
                <button class="tab" onclick="showCategory('scenes')">Scene Images</button>
                <button class="tab" onclick="showCategory('marketing')">Marketing Materials</button>
                <button class="tab" onclick="showCategory('social')">Social Media</button>
                <button class="tab" onclick="showCategory('web')">Website Images</button>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="stats-bar">
            <div class="stat">
                <div class="stat-number" id="total-assets">${categoryCounts.total || 0}</div>
                <div class="stat-label">Total Assets</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="character-count">${categoryCounts.character || 0}</div>
                <div class="stat-label">Character Images</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="logo-count">${categoryCounts.logos || 0}</div>
                <div class="stat-label">Logos</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="scene-count">${categoryCounts.scenes || 0}</div>
                <div class="stat-label">Scene Images</div>
            </div>
        </div>
        
        <div class="upload-zone">
            <h3 style="color: #D4AF37; margin-bottom: 1rem;">Quick Asset Upload</h3>
            <p>Drag and drop files here or click to browse</p>
            <input type="file" multiple accept="image/*" style="margin-top: 1rem;" onchange="handleFileUpload(this)">
        </div>
        
        <div id="asset-container">
            <div class="asset-grid" id="all-assets">
                ${assetCards}
            </div>
            
            <div class="asset-grid" id="empty-state" style="display: none;">
                <div class="empty-state">
                    <h3>No assets in this category</h3>
                    <p>Upload your first asset to get started</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showCategory(category) {
            // Update active tab
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            // Show/hide assets based on category
            const allAssets = document.querySelectorAll('.asset-card');
            const emptyState = document.getElementById('empty-state');
            let visibleCount = 0;
            
            allAssets.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || 
                    (category === 'character' && cardCategory === 'character') ||
                    (category === 'scenes' && cardCategory === 'scenes') ||
                    (category === 'logos' && cardCategory === 'logos') ||
                    (category === 'brand' && cardCategory === 'brand') ||
                    (category === 'marketing' && cardCategory === 'marketing') ||
                    (category === 'social' && cardCategory === 'social') ||
                    (category === 'web' && cardCategory === 'web')) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show empty state if no assets in category
            if (visibleCount === 0 && category !== 'all') {
                emptyState.style.display = 'grid';
                document.getElementById('all-assets').style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                document.getElementById('all-assets').style.display = 'grid';
            }
        }
        
        function downloadAsset(path, filename) {
            // Create download link
            const link = document.createElement('a');
            link.href = path;
            link.download = filename;
            link.click();
        }
        
        function viewFullSize(path) {
            window.open(path, '_blank');
        }
        
        function handleFileUpload(input) {
            const files = input.files;
            console.log('Files selected:', files.length);
            // Add upload handling logic here
            alert('File upload feature coming soon! For now, manually add files to the directory structure.');
        }
        
        // Auto-refresh asset count
        setInterval(() => {
            fetch('/api/asset-count')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('total-assets').textContent = data.total || 0;
                    document.getElementById('character-count').textContent = data.character || 0;
                    document.getElementById('logo-count').textContent = data.logos || 0;
                    document.getElementById('scene-count').textContent = data.scenes || 0;
                })
                .catch(() => {
                    // Keep current counts if API fails
                });
        }, 30000); // Refresh every 30 seconds
        
        // Initialize with all assets visible
        document.addEventListener('DOMContentLoaded', function() {
            showCategory('all');
        });
    </script>
</body>
</html>
  `);
});

// API endpoint for asset counting
app.get('/api/asset-count', (req, res) => {
  try {
    const assets = getAssetData();
    const categoryCounts = assets.reduce((counts, asset) => {
      counts[asset.category] = (counts[asset.category] || 0) + 1;
      counts.total = (counts.total || 0) + 1;
      return counts;
    }, {});
    
    res.json({
      total: categoryCounts.total || 0,
      character: categoryCounts.character || 0,
      logos: categoryCounts.logos || 0,
      scenes: categoryCounts.scenes || 0
    });
  } catch (error) {
    res.json({
      total: 0,
      character: 0,
      logos: 0,
      scenes: 0
    });
  }
});

// File browser API
app.get('/api/assets/:category', (req, res) => {
  const category = req.params.category;
  const categoryPath = path.join(__dirname, '03_Visual_Assets', category);
  
  try {
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath, { recursive: true });
      const assets = files
        .filter(file => typeof file === 'string' && /\.(png|jpg|jpeg|gif|svg)$/i.test(file))
        .map(file => ({
          name: file,
          path: `/assets/${category}/${file}`,
          size: fs.statSync(path.join(categoryPath, file)).size,
          modified: fs.statSync(path.join(categoryPath, file)).mtime
        }));
      
      res.json(assets);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`🎨 Eula Elite Brand Asset Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving assets from: ${path.join(__dirname, '03_Visual_Assets')}`);
  console.log(`🚀 Access your brand assets at: http://localhost:${PORT}`);
});