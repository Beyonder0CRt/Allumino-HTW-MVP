require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');
const LearningContent = require('../src/models/learningContent.model');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create sample user
    const user = await prisma.user.upsert({
      where: { email: 'demo@allumino.com' },
      update: {},
      create: {
        auth0Id: 'auth0|demo-user-123',
        email: 'demo@allumino.com',
        displayName: 'Demo User',
        avatarUrl: 'https://via.placeholder.com/150',
        roles: ['user'],
        metadata: { onboarded: true },
      },
    });
    console.log('✅ Created demo user:', user.email);

    // Create sample admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@allumino.com' },
      update: {},
      create: {
        auth0Id: 'auth0|admin-user-123',
        email: 'admin@allumino.com',
        displayName: 'Admin User',
        avatarUrl: 'https://via.placeholder.com/150',
        roles: ['admin', 'user'],
        metadata: { onboarded: true },
      },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create sample pathways
    const pathway1 = await prisma.pathway.create({
      data: {
        userId: user.id,
        title: 'Software Engineer',
        description: 'Complete pathway to becoming a software engineer',
        metadata: {
          tags: ['software', 'engineering', 'tech'],
          difficulty: 'intermediate',
          duration: '2-4 years',
        },
      },
    });
    console.log('✅ Created pathway:', pathway1.title);

    const pathway2 = await prisma.pathway.create({
      data: {
        userId: user.id,
        title: 'Chemical Engineer',
        description: 'Comprehensive path to chemical engineering career',
        metadata: {
          tags: ['chemistry', 'engineering', 'science'],
          difficulty: 'advanced',
          duration: '4-5 years',
        },
      },
    });
    console.log('✅ Created pathway:', pathway2.title);

    // Create sample learning content in MongoDB
    const content1 = await LearningContent.create({
      title: 'Introduction to Software Engineering',
      body: 'Software engineering is the application of engineering principles to software development...',
      attachments: [
        {
          url: 'https://example.com/intro-video.mp4',
          type: 'video',
          name: 'Introduction Video',
        },
      ],
      tags: ['software', 'basics', 'introduction'],
      createdBy: user.id,
    });
    console.log('✅ Created learning content:', content1.title);

    // Create sample assessments
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        pathwayId: pathway1.id,
        title: 'Programming Fundamentals Assessment',
        type: 'skills',
        score: 85.5,
        completedAt: new Date(),
        metadata: {
          totalQuestions: 20,
          correctAnswers: 17,
        },
      },
    });
    console.log('✅ Created assessment:', assessment.title);

    // Create sample opportunities
    const opportunity1 = await prisma.opportunity.create({
      data: {
        title: 'Software Engineering Internship',
        description: 'Summer internship opportunity for aspiring software engineers',
        location: 'San Francisco, CA',
        tags: ['internship', 'software', 'remote'],
        createdById: admin.id,
      },
    });
    console.log('✅ Created opportunity:', opportunity1.title);

    const opportunity2 = await prisma.opportunity.create({
      data: {
        title: 'Chemical Engineering Co-op',
        description: 'Co-op program for chemical engineering students',
        location: 'Houston, TX',
        tags: ['co-op', 'chemistry', 'on-site'],
        createdById: admin.id,
      },
    });
    console.log('✅ Created opportunity:', opportunity2.title);

    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
  }
}

seed();
