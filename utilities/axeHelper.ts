import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
];

export async function testAccessibility(page: Page, contextSelector: string = 'body') {
  const builder = new AxeBuilder({ page }).include(contextSelector).withTags(WCAG_TAGS);
  const results = await builder.analyze();
  printAxeViolations(results);
  return results;
}

export async function testAccessibilityByRule(
  page: Page,
  ruleId: string,
  minSeverity: 'minor' | 'moderate' | 'serious' | 'critical' = 'minor',
  contextSelector: string = 'body'
) {
  const builder = new AxeBuilder({ page })
    .include(contextSelector)
    .withTags(WCAG_TAGS)
    .withRules([ruleId]);
  const results = await builder.analyze();

  // Filter violations by severity
  const severityOrder = ['minor', 'moderate', 'serious', 'critical'];
  const minSeverityIdx = severityOrder.indexOf(minSeverity);
  const filteredViolations = results.violations.filter((v: any) => {
    if (!v.impact) return false;
    return severityOrder.indexOf(v.impact) >= minSeverityIdx;
  });
  printAxeViolations(results);
  return { ...results, violations: filteredViolations };
}

export function printAxeViolations(results: any) {
  if (!results.violations || results.violations.length === 0) {
    console.log('No accessibility violations found!');
    return;
  }
  for (const violation of results.violations) {
    console.log(`\n[${violation.id}] ${violation.help}`);
    for (const node of violation.nodes) {
      console.log(`  Target: ${node.target.join(', ')}`);
      console.log(`  Failure Summary: ${node.failureSummary}`);
    }
  }
} 