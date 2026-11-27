import { describe, expect, it } from 'vitest';
import { buildRecordHierarchy } from './RecordHierarchyModel.ts';

describe(buildRecordHierarchy.name, () => {
  it('nests voyages under their parent while keeping unrelated voyages at the root', () => {
    const child = { id: 'child', type: 'Voyage', part_of: [{ id: 'parent', type: 'Voyage' }] };
    const parent = { id: 'parent', type: 'Voyage' };
    const unrelated = { id: 'unrelated', type: 'Voyage' };

    const hierarchy = buildRecordHierarchy([child, unrelated, parent]);

    expect(hierarchy.map(({ record }) => record.id)).toEqual(['unrelated', 'parent']);
    expect(hierarchy[1].children.map(({ record }) => record.id)).toEqual(['child']);
  });

  it('keeps voyages at the root when their parent is not part of the list', () => {
    const child = { id: 'child', type: 'Voyage', part_of: [{ id: 'missing-parent', type: 'Voyage' }] };

    expect(buildRecordHierarchy([child]).map(({ record }) => record.id)).toEqual(['child']);
  });

  it('breaks parent cycles instead of recursing indefinitely', () => {
    const first = { id: 'first', type: 'Voyage', part_of: [{ id: 'second', type: 'Voyage' }] };
    const second = { id: 'second', type: 'Voyage', part_of: [{ id: 'first', type: 'Voyage' }] };

    const hierarchy = buildRecordHierarchy([first, second]);

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].children).toHaveLength(1);
  });
});
