import React, { useEffect } from 'react';
import { BookingNoId, OperatorDto, TripDto } from 'dtos';
import { Box, Button, TextField as MuiTextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { useUserState } from '../../state/user';
import { useBookingsState } from '../../state/bookings';
import { useRouter } from 'next/router';
import { urls } from 'urls';
import * as yup from 'yup';
import { FormBox } from '../form-box';
import { Formik, Field } from 'formik';
import { TextField } from 'formik-mui';
import { KeyValue } from '../key-value';
import { createPriceString } from 'utils';

const bookingModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

interface Props {
  operator: OperatorDto;
  trip: TripDto;

  onClose: () => void;
}

const validationSchema: yup.SchemaOf<Omit<BookingNoId, 'operator' | 'status' | 'trip'>> = yup.object().shape({
  name: yup.string().required('Enter your name'),
  email: yup.string().required('Enter your email').email('Enter a valid email address'),
  date: yup.string().required('Enter your departure date'),
  adultGuests: yup.number().min(1, 'Minimum of one adult required').max(10, 'Maximum of 10 adults allowed').required('Enter number of adults'),
  childGuests: yup.number().max(10, 'Maximum of 10 children allowed').required('Enter number of children'),
})

export const BookingForm: React.FC<Props> = ({ operator, trip, onClose }) => {
  const router = useRouter();

  const loggedinUser = useUserState(s => s.loggedInUser);
  const [createBookingStatus, createBooking, bookingId, clearBooking] = useBookingsState(s => [s.createBookingStatus, s.createBooking, s.bookingId, s.clearBooking]);

  const initialValues: Omit<BookingNoId, 'status'> = {
    operator,
    trip,
    name: loggedinUser?.givenName || '',
    email: loggedinUser?.email || '',
    date: dayjs().add(1, 'day').format('DD MMM YYYY'),
    adultGuests: 1,
    childGuests: 0,
  }

  useEffect(() => {
    if (!!bookingId) {
      clearBooking();
      router.push(urls.user.booking(bookingId));
    }
  }, [bookingId]);

  const isSubmitting = createBookingStatus === 'fetching';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={bookingModalStyle}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => createBooking({
            ...values,
            status: 'confirmed'
          })}
        >
          {({ isValid, values, setValues }) => (
            <FormBox title={`Book ${trip.name} by ${operator.name}`} onClose={onClose}>
              <Field
                component={TextField}
                name="name"
                label="Your name"
              />

              <Field
                component={TextField}
                name="email"
                label="Your email address"
                type="email"
              />

              <MobileDatePicker
                label="Date"
                inputFormat="DD/MM/YYYY"
                disabled={isSubmitting}
                minDate={dayjs().add(1, 'day')}
                value={values.date}
                onChange={date => setValues({ ...values, date: date!.format('DD MMM YYYY') })}
                renderInput={(params) => <MuiTextField {...params} disabled={isSubmitting} />}
              />

              <Field
                component={TextField}
                name="adultGuests"
                label="Number of adults"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 10, min: 1
                  }
                }}
              />

              <Field
                component={TextField}
                name="childGuests"
                label="Number of children"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 10, min: 0
                  }
                }}
              />

              <KeyValue label="Total Price" value={createPriceString(values, trip)} />

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  color="success"
                  type="submit"
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                >
                  Book now
                </Button>
              </Box>

              {createBookingStatus === 'error' && <Typography>There was an error creating your booking. Please try again later.</Typography>}
            </FormBox>
          )}
        </Formik>
      </Box>
    </LocalizationProvider>
  )
}
