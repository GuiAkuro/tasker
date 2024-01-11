import { Board } from "../components/board";

function HomePage() {
  return (
    <div className="h-screen bg-neutral-900">
      <div className="container mx-auto">
        <Board />
      </div>
    </div>
  );
}

export default HomePage;
