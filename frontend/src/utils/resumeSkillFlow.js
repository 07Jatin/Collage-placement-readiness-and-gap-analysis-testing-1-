import {
    buildExtendedQuiz,
    calculateVerifiedLevel,
    extractSkillsFromText,
    SKILL_KEYWORDS,
} from '../data/skillData';

const DEFAULT_SKILL_META = { icon: '🛠️' };

export function enrichBackendSkills(data) {
    const enrichedSkills = {};

    if (!data?.skills) {
        return enrichedSkills;
    }

    Object.entries(data.skills).forEach(([id, info]) => {
        const frontendSkillInfo = SKILL_KEYWORDS[id] || { ...DEFAULT_SKILL_META, category: info.category };
        enrichedSkills[id] = {
            ...info,
            icon: frontendSkillInfo.icon,
            verifiedLevel: null,
            quizScore: null,
            skillId: id,
            matchedKeywords: info.matched_keywords || [id]
        };
    });

    return enrichedSkills;
}

export function buildLocalSkillResults(resumeText) {
    return extractSkillsFromText(resumeText);
}

export function createQuizQuestions(skillId) {
    return buildExtendedQuiz(skillId, 25);
}

export function applyQuizOutcome(skills, skillId, score, total) {
    const level = calculateVerifiedLevel(score, total);

    return {
        ...skills,
        [skillId]: {
            ...skills[skillId],
            status: total > 0 ? 'verified' : 'unverified',
            verifiedLevel: total > 0 ? level : null,
            quizScore: total > 0 ? score : null
        }
    };
}
