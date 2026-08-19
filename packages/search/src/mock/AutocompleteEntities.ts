import places from './places.json' with { type: 'json' };
import polities from './polities.json' with { type: 'json' };

export type Entity = {
  id: string;
  type: 'Place' | 'Polity';
  label: string;
  alternatives: string[];
};

export const entities: Entity[] = [...places.map((place) => ({
  id: place.id,
  type: place.type as 'Place',
  label: place._label,
  alternatives: place.alternative_labels,
})), ...polities.map((polity) => ({
  id: polity.id,
  type: polity.type as 'Polity',
  label: polity._label,
  alternatives: polity.alternative_labels,
}))].sort((a, b) => a.label.localeCompare(b.label));
