import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { hashPassword } from '@/server/functions/bcrypt/bcrypt'

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, middleName, lastName, dateOfBirth, location, email, phone, password } = body

    // check for existing user by email and phone
    const user = await client.fetch(
      `*[_type == "resident" && (email == "${email}" || phoneNumber == "${phone}")][0]`
    )

    if (user) {
      return NextResponse.json(
        {
          type: 'fail',
          success: false,
          message: 'User already exists',
        },
        { status: 400 }
      )
    }

    // hash password
    const hashedPassword = await hashPassword(password)

    // create new user
    const sanity_user = await client.create({
      _type: 'resident',
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      address: location,
      email,
      phoneNumber: phone,
      passwordHash: hashedPassword,
    })

    if (sanity_user) {
      return NextResponse.json(
        {
          type: 'success',
          success: true,
          message: 'User created successfully',
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      {
        type: 'fail',
        success: false,
        message: 'User creation failed',
      },
      { status: 500 }
    )
  } catch (err) {
    console.error('Error creating user:', err)
    return NextResponse.json(
      {
        type: 'fail',
        success: false,
        message: 'User creation failed',
      },
      { status: 500 }
    )
  }
}
