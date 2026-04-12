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
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, tenantId: user.tenantId, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return { user, token };
};
