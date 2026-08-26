import { prisma } from '../src/lib/prisma';

async function main() {
  // User's Real Admin
  const realAdmin = await prisma.user.upsert({
    where: { email: 'sapemailb1@adm' },
    update: {},
    create: {
      email: 'sapemailb1@adm',
      name: 'Paulo Andre',
      password: 'admin',
      role: 'ADMIN',
    },
  });

  // Mock Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gymone.com' },
    update: {},
    create: {
      email: 'admin@gymone.com',
      name: 'Junior Glória',
      password: 'admin', // in a real app, hash this!
      role: 'ADMIN',
    },
  });

  // Mock Student (Pending Approval)
  const pendingStudent = await prisma.user.upsert({
    where: { email: 'joao.pendente@email.com' },
    update: {},
    create: {
      email: 'joao.pendente@email.com',
      name: 'João Pendente',
      password: '123',
      role: 'STUDENT',
      studentProfile: {
        create: {
          status: 'PENDING',
        }
      }
    },
  });

  // Mock Student (Approved)
  const approvedStudent = await prisma.user.upsert({
    where: { email: 'maria.aprovada@email.com' },
    update: {},
    create: {
      email: 'maria.aprovada@email.com',
      name: 'Maria Aprovada',
      password: '123',
      role: 'STUDENT',
      studentProfile: {
        create: {
          status: 'APPROVED',
          packageValue: 150.00,
          location: 'Plataforma',
          anamnesis: {
            create: {
              age: 28,
              weight: 65,
              height: 1.65,
              bmi: 23.8,
              goal: 'Hipertrofia',
              modality: 'Musculação'
            }
          }
        }
      }
    },
  });

  console.log({ admin, pendingStudent, approvedStudent });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
