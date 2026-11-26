import '@globalise/design/styles.css';
import './ObjectCardPage.css';
import { useEffect } from 'react';
import { getRouteApi } from '@globalise/router';
import { Container, Grid } from '@globalise/design';
import { handle } from '@globalise/common/uri';
import { loadObjectCard, ObjectCardView } from '@globalise/object-card';

const route = getRouteApi(`/${handle}/$`);

export function ObjectCardPage() {
  const { uri } = route.useParams();

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
