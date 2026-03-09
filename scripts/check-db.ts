import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const campaignsCount = await prisma.marketingCampaign.count()
        const contactsCount = await prisma.marketingContact.count()
        const groupsCount = await prisma.marketingGroup.count()
        console.log('Campaigns:', campaignsCount)
        console.log('Contacts:', contactsCount)
        console.log('Groups:', groupsCount)
    } catch (e: any) {
        console.error('Error code:', e.code)
        console.error('Error message:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
