export const passwordGenerate = (email: string, cpf: string) => {
  return `${email.split('@')[0].slice(0, 3)}${cpf.slice(-4)}
  ${'!@#$%&*'[Math.floor(Math.random() * 7)]}$
  {Math.floor(Math.random() * 10)}`;
};
