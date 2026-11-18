import {
  Decoration,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { entityTokenRegex, decodeEntityToken, entityTokensToLabels } from './entityToken';

import type { DecorationSet } from '@codemirror/view';
import type { AutocompleteConfig } from './SearchFieldConfig';
import type { EntityToken } from './entityToken';

export default function createEntitiesPlugin<E extends object>(config: AutocompleteConfig<E>, classNames: {
  entity?: string;
  entityIcon?: string;
  entityCross?: string;
}) {
  class EntityWidget<E extends object> extends WidgetType {
    private readonly entityToken: EntityToken;
    private readonly config: AutocompleteConfig<E>;

    constructor(entity: EntityToken, config: AutocompleteConfig<E>) {
      super();
      this.entityToken = entity;
      this.config = config;
    }

    eq(other: WidgetType) {
      return other instanceof EntityWidget && (
        this.entityToken.type === other.entityToken.type &&
                this.entityToken.id === other.entityToken.id &&
                this.entityToken.label === other.entityToken.label
      );
    }

    toDOM(view: EditorView) {
      const el = document.createElement('span');
      el.classList = `cm-entity ${classNames.entity}`.trim();

      if (this.config.token?.color) {
        const color = this.config.token.color(this.entityToken);
        if (color) {
          el.style.setProperty('--cm-entity-color', color);
        }
      }

      if (this.config.token?.icon) {
        const iconFromConfig = this.config.token.icon(this.entityToken);
        if (iconFromConfig) {
          const icon = iconFromConfig.cloneNode(true) as SVGElement;
          icon.classList = `cm-entity-icon ${classNames.entityIcon}`.trim();
          el.append(icon);
        }
      }

      const cross = document.createElement('span');
      cross.textContent = '✕';
      cross.classList = `cm-entity-cross ${classNames.entityCross}`.trim();
      cross.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const pos = view.posAtDOM(el);
        if (pos != null) {
          view.plugin(entitiesPlugin)?.entities.between(pos, pos, (from, to) =>
            view.dispatch({ changes: { from, to, insert: '' } }));
        }
      });

      el.append(document.createTextNode(this.entityToken.label), cross);

      return el;
    }
  }

  const entityMatcher = new MatchDecorator({
    regexp: entityTokenRegex,
    decoration: (match) => {
      const entityToken = decodeEntityToken(match[0]);
      return entityToken ? Decoration.replace({ widget: new EntityWidget(entityToken, config) }) : null;
    },
  });

  const entitiesPlugin = ViewPlugin.fromClass(class {
    entities: DecorationSet;

    constructor(view: EditorView) {
      this.entities = entityMatcher.createDeco(view);
    }

    update(update: ViewUpdate) {
      this.entities = entityMatcher.updateDeco(update, this.entities);
    }
  }, {
    decorations: (instance) => instance.entities,
    provide: (plugin) => [
      EditorView.atomicRanges.of((view) => view.plugin(plugin)?.entities ?? Decoration.none),
      EditorView.clipboardOutputFilter.of(entityTokensToLabels),
    ],
  });

  return entitiesPlugin;
}
