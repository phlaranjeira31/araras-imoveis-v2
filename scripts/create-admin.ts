
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Faltou ADMIN_EMAIL ou ADMIN_PASSWORD no .env");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: "ADMIN",
    },
    create: {
      email,
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin criado/atualizado:", {
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

