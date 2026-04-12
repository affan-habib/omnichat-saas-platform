import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  tenantName: z.string(),
  slug: z.string(),
});

export const registerTenant = async (data: z.infer<typeof registerSchema>) => {
  const { name, email, password, tenantName, slug } = registerSchema.parse(data);

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: tenantName,
        slug,
      },
    });

    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'OWNER',
        status: 'ONLINE',
        tenantId: tenant.id,
      },
    });

    const token = jwt.sign(
      { id: user.id, tenantId: tenant.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return { user, token };
  });
};

export const login = async (data: any) => {
  const { email, password } = data;
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid credentials') as any;
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, tenantId: user.tenantId, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return { user, token };
};
export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw Object.assign(new Error('Current password is incorrect'), { status: 400 });

  if (newPassword.length < 6) throw Object.assign(new Error('Password must be at least 6 characters'), { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, needsPasswordChange: false }
  });

  return { message: 'Password updated successfully' };
};
