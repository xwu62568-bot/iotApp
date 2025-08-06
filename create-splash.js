const fs = require('fs');
const path = require('path');

// 创建一个简单的1像素PNG作为临时解决方案
// 这是一个1x1的透明PNG的base64编码
const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77ggAAAABJRU5ErkJggg==', 'base64');

// 写入splash.png文件
fs.writeFileSync(path.join(__dirname, 'assets', 'splash.png'), pngData);

console.log('Temporary splash.png created successfully!');