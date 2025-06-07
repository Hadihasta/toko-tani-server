import bcrypt from "bcryptjs";

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
}

export async function comparePassword(password, hash) {
  const compare = await bcrypt.compare(password, hash);
  return compare;
}
