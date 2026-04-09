/**
 * Eligibility Engine
 * Determines student eligibility for a job based on criteria
 */

const CDCStudentProfile = require('../models/CDCStudentProfile');
const Profile = require('../models/Profile');

/**
 * Check if a student is eligible for a job
 * @param {Object} studentProfile - CDCStudentProfile document
 * @param {Object} jobEligibility - Job eligibilityCriteria
 * @param {Object} baseProfile - Profile document with skills
 * @returns {Object} { eligible: boolean, reasons: [string] }
 */
async function checkStudentEligibility(studentProfile, jobEligibility, baseProfile) {
  const reasons = [];
  let eligible = true;

  if (!studentProfile || !jobEligibility) {
    return { eligible: false, reasons: ['Invalid input'] };
  }

  // 1. Check CGPA
  if (jobEligibility.minCGPA && studentProfile.cgpa < jobEligibility.minCGPA) {
    reasons.push(`CGPA ${studentProfile.cgpa} < ${jobEligibility.minCGPA}`);
    eligible = false;
  }

  // 2. Check Branch
  if (jobEligibility.allowedBranches && jobEligibility.allowedBranches.length > 0) {
    if (!jobEligibility.allowedBranches.includes(studentProfile.branch)) {
      reasons.push(`Branch ${studentProfile.branch} not allowed`);
      eligible = false;
    }
  }

  // 3. Check Active Backlogs
  if (!jobEligibility.allowActiveBacklogs && studentProfile.activeBacklogs > 0) {
    reasons.push(`${studentProfile.activeBacklogs} active backlog(s) not allowed`);
    eligible = false;
  }

  // 4. Check Total Backlogs
  if (jobEligibility.maxTotalBacklogs !== undefined && studentProfile.totalBacklogs > jobEligibility.maxTotalBacklogs) {
    reasons.push(`Total backlogs ${studentProfile.totalBacklogs} > ${jobEligibility.maxTotalBacklogs}`);
    eligible = false;
  }

  // 5. Check Placement Restriction
  if (jobEligibility.alreadyPlacedRestriction && studentProfile.placementStatus === 'Placed') {
    reasons.push('Already placed; cannot apply');
    eligible = false;
  }

  // 6. Check Required Skills
  if (jobEligibility.requiredSkills && jobEligibility.requiredSkills.length > 0 && baseProfile) {
    const studentSkills = (baseProfile.skills || []).map(s => s.name.toLowerCase());
    const missingSkills = jobEligibility.requiredSkills.filter(
      skill => !studentSkills.includes(skill.toLowerCase())
    );
    if (missingSkills.length > 0) {
      reasons.push(`Missing skills: ${missingSkills.join(', ')}`);
      eligible = false;
    }
  }

  return { eligible, reasons };
}

/**
 * Calculate eligible students for a job
 * @param {Object} job - Job document with eligibilityCriteria
 * @returns {Object} { eligible: [studentIds], ineligible: [{ studentId, reasons }] }
 */
async function getEligibleStudents(job) {
  if (!job || !job.eligibilityCriteria) {
    return { eligible: [], ineligible: [] };
  }

  const cdcProfiles = await CDCStudentProfile.find()
    .populate('user', 'name email')
    .lean();

  const profiles = await Profile.find().lean();
  const profileMap = {};
  profiles.forEach(p => { profileMap[p.user.toString()] = p; });

  const eligible = [];
  const ineligible = [];

  for (const cdcProfile of cdcProfiles) {
    const baseProfile = profileMap[cdcProfile.user.toString()];
    const result = await checkStudentEligibility(cdcProfile, job.eligibilityCriteria, baseProfile);

    if (result.eligible) {
      eligible.push(cdcProfile.user.toString());
    } else {
      ineligible.push({
        studentId: cdcProfile.user.toString(),
        studentName: cdcProfile.user?.name || 'Unknown',
        reasons: result.reasons
      });
    }
  }

  return { eligible, ineligible };
}

module.exports = {
  checkStudentEligibility,
  getEligibleStudents
};
