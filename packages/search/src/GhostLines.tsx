import classes from './GhostLines.module.css';

export default function GhostLines() {
  return (
    <div className={classes.ghost}>
      {Array(7).map((_val, idx) => <div key={idx}/>)}
    </div>
  );
}
