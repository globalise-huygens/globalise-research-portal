import type { SearchFieldRef } from '@knaw-huc/searchfield/react';
import { useId, useRef, useState } from 'react';
import {
  IconClose,
  IconLeftPanelOpen,
  ToolButton,
  useIsMobile,
} from '@globalise/design';
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import Facets from './Facets';
import Selection from './Selection';
import SearchField from './SearchField';
import SearchQueryHelp from './SearchQueryHelp';
import Results from './Results';
import ResultsHeader from './ResultsHeader';
import classes from './Layout.module.css';

export default function Layout({ autoFocus = false }: { autoFocus?: boolean }) {
  const isMobile = useIsMobile();
  const [queryHelpOpen, setQueryHelpOpen] = useState(false);
  const queryHelpId = useId();
  const searchFieldRef = useRef<SearchFieldRef>(null);

  return (
    <div className={classes.search}>
      <div className={classes.searchControls}>
        <div className={classes.searchHeader}>
          <SearchField
            editorRef={searchFieldRef}
            autoFocus={autoFocus}
            isMobile={isMobile}
            queryHelpId={queryHelpId}
            queryHelpOpen={queryHelpOpen}
            onToggleQueryHelp={() => setQueryHelpOpen((open) => !open)}
          />
          {isMobile && (
            <DialogTrigger>
              <ToolButton size="touch" aria-label="Open filters"
                icon={<IconLeftPanelOpen aria-hidden="true" />}
              />
              <ModalOverlay isDismissable className={classes.filterOverlay}>
                <Modal className={classes.filterDrawer}>
                  <Dialog className={classes.filterDialog}>
                    {({ close }) => (
                      <>
                        <header className={classes.filterHeader}>
                          <Heading slot="title">Filters</Heading>
                          <ToolButton size="touch" aria-label="Close filters"
                            icon={<IconClose aria-hidden="true" />}
                            onPress={close}
                          />
                        </header>
                        <div className={classes.filterList}><Facets /></div>
                      </>
                    )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          )}
        </div>

        <div className={classes.selectionSlot}>
          <Selection/>
        </div>
      </div>

      <div className={classes.facetSearch} aria-hidden="true"/>

      {!isMobile && <div className={classes.facets}><Facets /></div>}

      <div className={classes.resultList}>
        <SearchQueryHelp
          id={queryHelpId}
          open={queryHelpOpen}
          onInsert={(text, cursorOffset) =>
            searchFieldRef.current?.insertQuery(text, cursorOffset)
          }
        />
        <ResultsHeader/>
        <Results/>
      </div>
    </div>
  );
}
