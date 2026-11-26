import '@globalise/design/styles.css';
import './ObjectCardPage.css';
import { useEffect } from 'react';
import { getRouteApi } from '@globalise/router';
import { Container, Grid } from '@globalise/design';
import { thesaurusBase } from '@globalise/common/uri';
import { loadObjectCard, ObjectCardView } from '@globalise/object-card';

const route = getRouteApi('/object-card/');

const defaultUri = `${thesaurusBase}00caf575-0d33-49f0-83d7-3f550c681355`;

export function ObjectCardPage() {
  const { uri } = route.useSearch();

  useEffect(() => {
    loadObjectCard(uri ?? defaultUri).catch(console.error);
  }, [uri]);

  return (
    <main className='object-card-page'>
      <Container>
        <Grid>
          <div className="slot-content-band">
            <ObjectCardView/>
          </div>
        </Grid>
      </Container>
    </main>
  );
}