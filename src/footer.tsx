const Footer = () => {
  return (
    <>
      <hr />
      <div className="flex items-center justify-center mt-3">
        Desarrollado por{" "}
        <a
          target="_blank"
          className="mx-1 underline text-purple-600"
          href="https://www.linkedin.com/in/leonardosantacruz/"
        >
          Leo
        </a>
        , creado por{" "}
        <a
          target="_blank"
          className="mx-1 underline text-purple-600"
          href="https://monicasenillosa.com/"
        >
          Mónica Senillosa
        </a>
      </div>

      <div className="flex items-center justify-center text-black/50 text-sm mt-2">
        Basado en "La sabiduria del Eneagrama" de Don Richard Riso e
        investigacion de Jordi Pons
      </div>
    </>
  );
};

export default Footer;
