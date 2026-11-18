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
import Results from './Results';
import ResultsHeader from './ResultsHeader';
import classes from './Layout.module.css';

export default function Layout({ autoFocus = false }: { autoFocus?: boolean }) {
  const isMobile = useIsMobile();

  return (
    <div className={classes.search}>
      <div className={classes.searchHeader}>
        <SearchField autoFocus={autoFocus} isMobile={isMobile} />
        {isMobile && (
          <DialogTrigger>
            <ToolButton size="touch" aria-label="Open facettes"
              icon={<IconLeftPanelOpen aria-hidden="true" />}
            />
            <ModalOverlay isDismissable className={classes.filterOverlay}>
              <Modal className={classes.filterDrawer}>
                <Dialog className={classes.filterDialog}>
                  {({ close }) => (
                    <>
                      <header className={classes.filterHeader}>
                        <Heading slot="title">Facettes</Heading>
                        <ToolButton size="touch" aria-label="Close facettes"
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

      <div className={classes.facetSearch} aria-hidden="true"/>

      {!isMobile && <div className={classes.facets}><Facets /></div>}

      <div className={classes.selectionSlot}>
        <Selection/>
      </div>

      <div className={classes.resultList}>
        <ResultsHeader/>
        <Results/>
      </div>
    </div>
  );
}
