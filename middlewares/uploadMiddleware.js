// multer for file uploads. Used to handle multipart. If not used, no file handling. Alternatives: Busboy.
const multer = require('multer');

// path for file paths. Used to join paths. If not used, manual string concat. Alternatives: Path.join always.
const path = require('path');

// Storage config for disk. Used to save files to disk. If not used, memory storage. Alternatives: Memory.
const storage = multer.diskStorage({
  // Destination function. Used to set upload folder. If not used, default. Alternatives: Fixed path.
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  // Filename function. Used to generate unique names. If not used, original names. Alternatives: UUID.
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${timestamp}-${safeName}`);
  },
});

// File filter function. Used to restrict file types. If not used, all files allowed. Alternatives: No filter.
function fileFilter(req, file, cb) {
  const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (png, jpg, jpeg, webp, gif)'), false);
  }
}

// Multer instance. Used to create middleware. If not used, no upload. Alternatives: Custom parser.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Export upload. Used to use in routes. If not used, not available. Alternatives: Export config.
module.exports = upload;
