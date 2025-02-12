const Footer = () => {
  return (
    <>
      <hr />
      <div className="flex items-center justify-center mt-3">
        Creado por{" "}
        <a
          target="_blank"
          className="mx-1 underline text-purple-600"
          href="https://www.linkedin.com/in/leonardosantacruz/"
        >
          Leo
        </a>
        con colaboración de{" "}
        <a
          target="_blank"
          className="mx-1 underline text-purple-600"
          href="https://monicasenillosa.com/"
        >
          Mónica Senillosa
        </a>
      </div>

      <div className="flex items-center justify-center text-black/50 text-sm mt-2">
        Basado en bibliografia de Salvador A. Carrión Lopez y Jordi Pons
      </div>
    </>
  );
};

export default Footer;
