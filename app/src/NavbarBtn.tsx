import './styles/navbar.css';

export function NavbarBtn({ btnName }: { btnName: string }) {
  function handleClick() {
    alert('You clicked ' + btnName);
  }

  return (
    <button className="navbar-btn mt-9 w-fit text-white " onClick={handleClick}>
      {btnName}
    </button>
  );
}
