import '@globalise/design/styles.css';
import './ObjectCardPage.css';
import { useEffect } from 'react';
import { getRouteApi } from '@globalise/router';
import { Container, Grid } from '@globalise/design';
import { handle, thesaurusBase } from '@globalise/common/uri';
import { loadObjectCard, ObjectCardView } from '@globalise/object-card';

const searchRoute = getRouteApi('/object-card/');
const handleRoute = getRouteApi(`/${handle}/$`);

const defaultUri = `${thesaurusBase}00caf575-0d33-49f0-83d7-3f550c681355`;

export function ObjectCardPage() {
  const { uri } = searchRoute.useSearch();
  return <ObjectCard uri={uri ?? defaultUri}/>;
}

export function HandleObjectCardPage() {
  const { uri } = handleRoute.useParams();
  return <ObjectCard uri={uri}/>;
}

function ObjectCard({ uri }: { uri: string }) {
  useEffect(() => {
    loadObjectCard(uri).catch(console.error);
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