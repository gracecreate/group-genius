import { Student, Group } from "@/types/student";

export function groupStudentsByPreferences(
  students: Student[],
  groupSize: number = 3
): Group[] {
  if (students.length === 0) return [];

  const ungrouped = [...students];
  const groups: Group[] = [];
  let groupId = 1;

  while (ungrouped.length > 0) {
    const group: Student[] = [];
    
    // Start with the first ungrouped student
    const firstStudent = ungrouped.shift()!;
    group.push(firstStudent);

    // Find students with the most matching preferences
    while (group.length < groupSize && ungrouped.length > 0) {
      let bestMatchIndex = -1;
      let bestMatchScore = -1;

      for (let i = 0; i < ungrouped.length; i++) {
        const score = calculateMatchScore(group, ungrouped[i]);
        if (score > bestMatchScore) {
          bestMatchScore = score;
          bestMatchIndex = i;
        }
      }

      if (bestMatchIndex !== -1) {
        group.push(ungrouped.splice(bestMatchIndex, 1)[0]);
      } else {
        break;
      }
    }

    // Find common preferences in the group
    const commonPreferences = findCommonPreferences(group);

    groups.push({
      id: `group-${groupId++}`,
      students: group,
      commonPreferences,
    });
  }

  return groups;
}

function calculateMatchScore(group: Student[], candidate: Student): number {
  let score = 0;
  
  for (const student of group) {
    for (let i = 0; i < student.preferences.length; i++) {
      const pref = student.preferences[i];
      const candidateIndex = candidate.preferences.indexOf(pref);
      
      if (candidateIndex !== -1) {
        // Higher score for matching preferences that are ranked similarly
        const positionDiff = Math.abs(i - candidateIndex);
        score += (student.preferences.length - positionDiff);
      }
    }
  }
  
  return score;
}

function findCommonPreferences(group: Student[]): string[] {
  if (group.length === 0) return [];
  
  const preferenceCounts = new Map<string, number>();
  
  for (const student of group) {
    for (const pref of student.preferences) {
      preferenceCounts.set(pref, (preferenceCounts.get(pref) || 0) + 1);
    }
  }
  
  // Return preferences that appear in at least half the group
  const threshold = Math.ceil(group.length / 2);
  return Array.from(preferenceCounts.entries())
    .filter(([_, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([pref]) => pref);
}
