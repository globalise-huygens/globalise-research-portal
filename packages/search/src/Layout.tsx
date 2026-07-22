import Facets from './Facets';
import Selection from './Selection';
import Results from './Results';
import classes from './Layout.module.css';

export default function Layout() {
  return (
    <div className={classes.search}>
      <div className={classes.facets}>
        <Facets/>
      </div>

      <div className={classes.results}>
        <Selection/>
        <Results/>
      </div>
    </div>
  );
}
