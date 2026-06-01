jest.mock('../../models/TechnicalIssue');
jest.mock('../../models/Tour');

const TechnicalIssue = require('../../models/TechnicalIssue');
const Tour           = require('../../models/Tour');
const { submitIssue, getMyIssues, getIssues, updateIssueStatus } = require('../../controllers/issueController');

const res = () => { const r = {}; r.status = jest.fn().mockReturnValue(r); r.json = jest.fn().mockReturnValue(r); return r; };
beforeEach(() => jest.clearAllMocks());

// submitIssue
test('submitIssue: 400 when required fields missing', async () => {
  const r = res();
  await submitIssue({ user: { id: 'g1' }, body: { title: 'T' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('submitIssue: 404 when tour not found or not assigned to guide', async () => {
  Tour.findOne = jest.fn().mockResolvedValue(null);
  const r = res();
  await submitIssue({ user: { id: 'g1' }, body: { title: 'T', description: 'D', tourId: 't1' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('submitIssue: 201 on success with no file', async () => {
  Tour.findOne = jest.fn().mockResolvedValue({ _id: 't1', title: 'Tour' });
  TechnicalIssue.create = jest.fn().mockResolvedValue({ _id: 'i1' });
  const r = res();
  await submitIssue({ user: { id: 'g1' }, body: { title: 'T', description: 'D', tourId: 't1', severity: 'High' }, file: null }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(TechnicalIssue.create).toHaveBeenCalledWith(expect.objectContaining({ attachmentUrl: '' }));
});

test('submitIssue: 201 with attachment url from file', async () => {
  Tour.findOne = jest.fn().mockResolvedValue({ _id: 't1' });
  TechnicalIssue.create = jest.fn().mockResolvedValue({ _id: 'i1' });
  const r = res();
  await submitIssue({ user: { id: 'g1' }, body: { title: 'T', description: 'D', tourId: 't1' }, file: { path: 'https://cdn/img.jpg' } }, r);
  expect(TechnicalIssue.create).toHaveBeenCalledWith(expect.objectContaining({ attachmentUrl: 'https://cdn/img.jpg' }));
});

// getMyIssues
test('getMyIssues: returns issues for guide', async () => {
  TechnicalIssue.find = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: 'i1' }]) }) });
  const r = res();
  await getMyIssues({ user: { id: 'g1' } }, r);
  expect(r.json).toHaveBeenCalledWith([{ _id: 'i1' }]);
  expect(TechnicalIssue.find).toHaveBeenCalledWith({ guideId: 'g1' });
});

// getIssues
test('getIssues: returns all issues', async () => {
  TechnicalIssue.find = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
  const r = res();
  await getIssues({}, r);
  expect(r.json).toHaveBeenCalledWith([]);
});

// updateIssueStatus
test('updateIssueStatus: 400 on invalid status', async () => {
  const r = res();
  await updateIssueStatus({ params: { id: 'i1' }, body: { status: 'Flying' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('updateIssueStatus: 404 when issue not found', async () => {
  TechnicalIssue.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(null) }) });
  const r = res();
  await updateIssueStatus({ params: { id: 'bad' }, body: { status: 'Done' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('updateIssueStatus: returns updated issue', async () => {
  const issue = { _id: 'i1', status: 'Done' };
  TechnicalIssue.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(issue) }) });
  const r = res();
  await updateIssueStatus({ params: { id: 'i1' }, body: { status: 'Done', managerNotes: 'Fixed' } }, r);
  expect(r.json).toHaveBeenCalledWith(issue);
});
