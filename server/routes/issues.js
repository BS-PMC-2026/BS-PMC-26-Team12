const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl   = require('../controllers/issueController');

router.post('/',             protect, requireRole('guide'), upload.single('attachment'), ctrl.submitIssue);
router.get('/my',            protect, requireRole('guide'), ctrl.getMyIssues);
router.get('/',              protect, requireRole('admin'), ctrl.getIssues);
router.patch('/:id/status',  protect, requireRole('admin'), ctrl.updateIssueStatus);

module.exports = router;
