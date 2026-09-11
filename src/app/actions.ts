"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateExpressWorkout(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { anamnesis: true }
  });

  if (!student || !student.anamnesis) {
    throw new Error("Ficha de anamnese não encontrada para este aluno.");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Chave de API do Gemini não configurada no servidor.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `Você é um personal trainer de elite focado em treinos rápidos e eficientes. 
Sua tarefa é gerar um "Treino Express" (15 a 30 minutos) focado primariamente no peso do corpo (bodyweight/funcional) para o seguinte aluno:

- Idade: ${student.anamnesis.age || 'Não informada'}
- Peso: ${student.anamnesis.weight ? student.anamnesis.weight + 'kg' : 'Não informado'}
- IMC: ${student.anamnesis.bmi || 'Não calculado'}
- Objetivo Principal: ${student.anamnesis.goal || 'Manutenção da saúde'}
- Modalidade de Interesse: ${student.anamnesis.modality || 'Geral'}
- Experiência de Treino: ${student.anamnesis.trainingExperience || 'Iniciante'}
- Disponibilidade: ${student.anamnesis.trainingAvailability || '3x semana'}

Restrições e Condições Médicas:
- Tem condição de saúde ou lesão? ${student.anamnesis.hasHealthCondition ? `Sim (${student.anamnesis.healthConditionDetails})` : 'Não'}
- Dor no peito durante esforço? ${student.anamnesis.chestPain ? 'Sim' : 'Não'}
- Desmaio ou tontura no exercício? ${student.anamnesis.faintingOrDizziness ? 'Sim' : 'Não'}
- Falta de ar durante o esforço? ${student.anamnesis.shortnessOfBreath ? 'Sim' : 'Não'}
- Condição Cardiovascular? ${student.anamnesis.cardiovascularCondition ? 'Sim' : 'Não'}
- Recomendação médica para evitar atividade? ${student.anamnesis.medicalRestriction ? 'Sim' : 'Não'}
- Retomando exercícios pós-cirurgia? ${student.anamnesis.postSurgery ? 'Sim' : 'Não'}

IMPORTANTE: Se o aluno tiver qualquer condição de saúde, problema cardíaco, histórico de dor no peito, falta de ar, tontura, restrição médica ou for pós-cirúrgico, você DEVE gerar um treino de baixíssimo impacto, com advertências claras de que o treino é leve e o aluno deve respeitar seus limites. Adapte os exercícios para não agravar essas condições.

O treino deve ser prático, ir direto ao ponto e não requerer equipamentos complexos. Respeite o perfil do aluno (ex: se for obeso, evite alto impacto).
Formato obrigatório da sua resposta (use markdown leve sem exagerar no tamanho):
💪 **Aquecimento:** (exercícios rápidos)
🔥 **Circuito Principal:** (3 a 5 exercícios, descreva séries e repetições/tempo)
🧘 **Volta à calma:** (1 ou 2 alongamentos)

Retorne APENAS o treino, sem introduções ou mensagens de "aqui está seu treino". Seja encorajador mas vá direto ao ponto.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro ao gerar treino no Gemini:", error);
    throw new Error("Falha ao gerar treino com Inteligência Artificial.");
  }
}

export async function saveAiWorkout(studentId: string, exercisesText: string) {
  await prisma.workout.create({
    data: {
      studentId,
      title: "Treino Express IA",
      description: "Treino rápido gerado pela Inteligência Artificial",
      exercises: exercisesText,
    }
  });
  revalidatePath(`/dashboard/${studentId}`);
}

import { cookies } from "next/headers";

export async function approveStudent(studentId: string, packageValue: number, location: string) {
  await prisma.student.update({
    where: { id: studentId },
    data: {
      status: "APPROVED",
      packageValue,
      location
    }
  });
  
  revalidatePath("/admin");
}

export async function rejectStudent(studentId: string) {
  await prisma.student.update({
    where: { id: studentId },
    data: { status: "REJECTED" }
  });
  
  revalidatePath("/admin");
}

export async function saveAnamnesis(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const age = parseInt(formData.get("age") as string);
  const weight = parseFloat(formData.get("weight") as string);
  const height = parseFloat(formData.get("height") as string);
  const goal = formData.get("goal") as string;
  const modality = formData.get("modality") as string;
  const gender = formData.get("gender") as string || "Masculino";
  
  const trainingExperience = formData.get("trainingExperience") as string;
  const trainingAvailability = formData.get("trainingAvailability") as string;
  const hasHealthCondition = formData.get("hasHealthCondition") === "true";
  const healthConditionDetails = formData.get("healthConditionDetails") as string;
  const chestPain = formData.get("chestPain") === "true";
  const faintingOrDizziness = formData.get("faintingOrDizziness") === "true";
  const shortnessOfBreath = formData.get("shortnessOfBreath") === "true";
  const cardiovascularCondition = formData.get("cardiovascularCondition") === "true";
  const medicalRestriction = formData.get("medicalRestriction") === "true";
  const postSurgery = formData.get("postSurgery") === "true";
  
  const bmi = height > 0 ? (weight / (height * height)) : 0;
  
  const data = {
    age, weight, height, bmi, goal, modality, gender,
    trainingExperience, trainingAvailability, hasHealthCondition, healthConditionDetails,
    chestPain, faintingOrDizziness, shortnessOfBreath, cardiovascularCondition, medicalRestriction, postSurgery
  };

  await prisma.anamnesis.upsert({
    where: { studentId },
    update: data,
    create: { studentId, ...data }
  });
  
  revalidatePath(`/admin/students/${studentId}/anamnesis`);
  revalidatePath(`/admin/students/${studentId}/assessments`);
  redirect("/admin");
}

import { calculateCooperVo2Max, classifyCooper, calculate1RM } from "@/lib/fitnessCalculations";

export async function savePhysicalAssessment(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const cooperDistanceStr = formData.get("cooperDistance") as string;
  const oneRmExercise = formData.get("oneRmExercise") as string;
  const oneRmWeightStr = formData.get("oneRmWeight") as string;
  const oneRmRepsStr = formData.get("oneRmReps") as string;
  const isVisibleToStudent = formData.get("isVisibleToStudent") === "true" || formData.get("isVisibleToStudent") === "on";
  const notes = formData.get("notes") as string;

  const cooperDistance = cooperDistanceStr ? parseFloat(cooperDistanceStr) : null;
  const oneRmWeight = oneRmWeightStr ? parseFloat(oneRmWeightStr) : null;
  const oneRmReps = oneRmRepsStr ? parseInt(oneRmRepsStr) : null;

  // Busca dados de idade e sexo do aluno na anamnese
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { anamnesis: true }
  });

  const age = student?.anamnesis?.age ?? 25;
  const gender = student?.anamnesis?.gender ?? "Masculino";

  let cooperVo2Max: number | null = null;
  let cooperClassification: string | null = null;

  if (cooperDistance && cooperDistance > 0) {
    cooperVo2Max = calculateCooperVo2Max(cooperDistance);
    const classificationResult = classifyCooper(cooperVo2Max, age, gender);
    cooperClassification = classificationResult.classification;
  }

  let oneRmResultEpley: number | null = null;
  let oneRmResultBrzycki: number | null = null;

  if (oneRmWeight && oneRmWeight > 0 && oneRmReps && oneRmReps > 0) {
    const rm = calculate1RM(oneRmWeight, oneRmReps);
    oneRmResultEpley = rm.epley;
    oneRmResultBrzycki = rm.brzycki;
  }

  await prisma.physicalAssessment.create({
    data: {
      studentId,
      cooperDistance,
      cooperVo2Max,
      cooperClassification,
      oneRmExercise: oneRmExercise || "Geral",
      oneRmWeight,
      oneRmReps,
      oneRmResultEpley,
      oneRmResultBrzycki,
      isVisibleToStudent,
      notes: (() => {
        const targetGoal = formData.get("targetGoal") as string;
        let finalNotes = notes || "";
        if (targetGoal) {
          const goalLabel = targetGoal === "forca" ? "Força Máxima" : targetGoal === "resistencia" ? "Resistência Muscular" : targetGoal === "potencia" ? "Potência" : "Hipertrofia";
          if (!finalNotes.includes(goalLabel)) {
            finalNotes = `[Objetivo: ${goalLabel}] ${finalNotes}`.trim();
          }
        }
        return finalNotes || null;
      })(),
    }

  });

  revalidatePath(`/admin/students/${studentId}/assessments`);
  revalidatePath(`/admin/students/${studentId}/report`);
  revalidatePath(`/dashboard/${studentId}`);
}

export async function toggleAssessmentVisibility(assessmentId: string, studentId: string, isVisible: boolean) {
  await prisma.physicalAssessment.update({
    where: { id: assessmentId },
    data: { isVisibleToStudent: isVisible }
  });

  revalidatePath(`/admin/students/${studentId}/assessments`);
  revalidatePath(`/admin/students/${studentId}/report`);
  revalidatePath(`/dashboard/${studentId}`);
}

export async function deletePhysicalAssessment(assessmentId: string, studentId: string) {
  await prisma.physicalAssessment.delete({
    where: { id: assessmentId }
  });

  revalidatePath(`/admin/students/${studentId}/assessments`);
  revalidatePath(`/admin/students/${studentId}/report`);
  revalidatePath(`/dashboard/${studentId}`);
}

export async function requestAccess(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string; // mock
  
  // In a real app, hash password and handle errors
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "STUDENT",
        studentProfile: {
          create: {
            status: "PENDING"
          }
        }
      }
    });
    
    redirect("/login?requested=true");
  } catch (error: any) {
    if (error.code === "P2002") {
      redirect("/register?error=email_exists");
    }
    throw error;
  }
}

export async function addWorkout(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const exercises = formData.get("exercises") as string;
  const videoUrl = formData.get("videoUrl") as string;
  
  await prisma.workout.create({
    data: {
      studentId,
      title,
      description,
      exercises,
      videoUrl
    }
  });
  
  revalidatePath(`/admin/students/${studentId}/workout`);
}

export async function deleteWorkout(id: string, studentId: string) {
  await prisma.workout.delete({ where: { id } });
  revalidatePath(`/admin/students/${studentId}/workout`);
}

export async function getStudentReportData(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      anamnesis: true,
      workouts: true,
      assessments: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!student) return null;

  return { student };
}

export async function adminCreateStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const location = formData.get("location") as string;
  const packageValueStr = formData.get("packageValue") as string;
  const packageValue = packageValueStr ? parseFloat(packageValueStr) : 0;

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "STUDENT",
        studentProfile: {
          create: {
            status: "APPROVED",
            location,
            packageValue
          }
        }
      }
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      redirect("/admin/students/new?error=email_exists");
    }
    throw error;
  }
  
  revalidatePath("/admin");
  redirect("/admin");
}

export async function adminUpdateStudent(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const location = formData.get("location") as string;
  const packageValueStr = formData.get("packageValue") as string;
  const packageValue = packageValueStr ? parseFloat(packageValueStr) : 0;

  // We need the User ID to update name, email, password
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw new Error("Student not found");

  try {
    await prisma.user.update({
      where: { id: student.userId },
      data: {
        name,
        email,
        ...(password ? { password } : {}),
      }
    });

    await prisma.student.update({
      where: { id: studentId },
      data: {
        location,
        packageValue
      }
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      redirect(`/admin/students/${studentId}/edit?error=email_exists`);
    }
    throw error;
  }
  
  revalidatePath("/admin");
  redirect("/admin");
}

export async function adminDeleteStudent(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return;

  // We delete the user, which should cascade and delete the student profile, anamnesis, and workouts
  // assuming onDelete: Cascade is set on user -> studentProfile.
  // Wait, in schema.prisma, Student relation to User: user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  await prisma.user.delete({ where: { id: student.userId } });

  revalidatePath("/admin");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { studentProfile: true }
  });

  if (!user || user.password !== password) {
    redirect("/login?error=invalid");
  }

    // In a real app, you'd set a session cookie here.
    // Setting simple cookies for MVP
    const cookieStore = await cookies();
    cookieStore.set("session_user_id", user.id);
    cookieStore.set("session_role", user.role);
    if (user.studentProfile) {
      cookieStore.set("session_student_id", user.studentProfile.id);
    }

    if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      if (!user.studentProfile) {
        throw new Error("Student profile not found.");
      }
      redirect(`/dashboard/${user.studentProfile.id}`);
    }
}
