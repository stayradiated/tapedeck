const Pause = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M14,7V25a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V7A1,1,0,0,1,8,6h5A1,1,0,0,1,14,7Zm9-1H18a1,1,0,0,0-1,1V25a1,1,0,0,0,1,1h5a1,1,0,0,0,1-1V7A1,1,0,0,0,23,6Z" />
  </svg>
)

const Play = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M24.8175,16.86432,9.503,25.77667A1,1,0,0,1,8,24.91235V7.08765a1,1,0,0,1,1.503-.86432L24.8175,15.13568A1.00006,1.00006,0,0,1,24.8175,16.86432Z" />
  </svg>
)

const SkipToPrevious = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path
      id="skip-to-previous"
      d="M22.99933,9.46185V22.53821a.8.8,0,0,1-1.2312.67383L11.55219,16.67383a.8.8,0,0,1,0-1.34766L21.76813,8.788A.8.8,0,0,1,22.99933,9.46185ZM10,8H9A1,1,0,0,0,8,9V23a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V9A1,1,0,0,0,10,8Z"
    />
  </svg>
)

const SkipToNext = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path
      id="skip-to-next"
      d="M20.44781,15.32617a.8.8,0,0,1,0,1.34766L10.23187,23.212a.8.8,0,0,1-1.2312-.67383V9.46185a.8.8,0,0,1,1.2312-.67383ZM23,8H22a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V9A1,1,0,0,0,23,8Z"
    />
  </svg>
)

const ChevronUp = () => (
  <svg
    id="glyphicons-basic"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
  >
    <path
      id="chevron-up"
      d="M26.91425,19.586l-2.8285,2.82806a.5.5,0,0,1-.70709,0L16,15.03564,8.62134,22.41406a.5.5,0,0,1-.70709,0L5.08575,19.586a.50007.50007,0,0,1,0-.70715L15.29291,8.67151a.99988.99988,0,0,1,1.41418,0L26.91425,18.87885A.50007.50007,0,0,1,26.91425,19.586Z"
    />
  </svg>
)

export { Pause, Play, SkipToNext, SkipToPrevious, ChevronUp }
