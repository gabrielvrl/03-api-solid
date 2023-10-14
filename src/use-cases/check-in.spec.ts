import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it('Should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // Red, Green, Refactor

  it('Should not be able to check in two times in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    await expect(() => sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })).rejects.toBeInstanceOf(Error)
  })

  it('Should be able to check in two times but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })


    expect(checkIn.id).toEqual(expect.any(String))
  })
})