/**
 * Skill Gap Analysis
 * Compares required career skills vs user skills
 */

export function computeSkillGap(userSkills: string[], requiredSkills: string[]) {
  const userSkillsLower = (userSkills || []).map((s) => s.toLowerCase().trim());

  const have: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    const skillLower = skill.toLowerCase().trim();
    if (
      userSkillsLower.some(
        (us) => us.includes(skillLower) || skillLower.includes(us),
      )
    ) {
      have.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const completionPercent =
    requiredSkills.length > 0
      ? Math.round((have.length / requiredSkills.length) * 100)
      : 0;

  return { have, missing, completionPercent };
}

export function getSkillGapPriority(missingSkills: string[], careerData: any) {
  const priorities = careerData?.skillPriority || {};
  return missingSkills.sort((a, b) => {
    const pa = priorities[a] ?? 5;
    const pb = priorities[b] ?? 5;
    return pb - pa;
  });
}
