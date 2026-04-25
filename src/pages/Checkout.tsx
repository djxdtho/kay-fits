import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Truck, Lock, AlertCircle } from 'lucide-react'
import { supabaseAdmin } from '../lib/supabase'
import { useCartStore } from '../store/cart'
import { toast } from 'sonner'

const nigerianStates: Record<string, string[]> = {
  'Abia': ['Umuahia', 'Aba', 'Ohuhu', 'Nsulu', 'Isuikwuato', 'Arochukwu', 'Ugunwa', 'Ikwera', 'Obuda', 'Okeopara', 'Umune', 'Uluasa', 'Dambazara', 'Mbawsi', 'Uratta'],
  'Adamawa': ['Yola', 'Mubi', 'Jimeta', 'Gombi', 'Ribadu', 'Nasarawa', 'Jada', 'Balkassa', 'Lamma', 'Song', 'Toungo', 'Mayo Belwa', 'Gerie', 'Kiri', 'Labudo'],
  'Akwa Ibom': ['Uyo', 'Ikot Ekpene', 'Eket', 'Oron', 'Uruan', 'Ikot Abasi', 'Etinan', 'Ikenge', 'Okobo', 'Onna', 'Ika', 'Ibeno', 'Oruk Anam', 'Ini', 'Esit Eket'],
  'Anambra': ['Awka', 'Onitsha', 'Nnewi', 'Ekws', 'Ife', ' Ihiala', 'Njikoka', 'Dunukofia', 'Ayamelum', 'Anaocha', 'Niger', 'Orumba North', 'Orumba South', 'Aguata', 'Ilorin'],
  'Bauchi': ['Bauchi', 'Ningi', 'Misau', 'Alkaleri', 'Darako', 'Gamawa', 'Bogoro', 'Itas Gadau', 'Zaki', 'Katagum', 'Ganjuwa', 'Damban', 'Tafawa Balewa', 'Jamaare', 'Shira'],
  'Bayelsa': ['Yenagoa', 'Ogbia', 'Kolokuma', 'Opokuma', 'Nembe', 'Sagbama', 'Ekeremor', 'Southern Ijaw', 'Western Ijaw', 'Central Ijaw', 'Okordia', 'Tarakiri'],
  'Benue': ['Makurdi', 'Otukpo', 'Gboko', 'Katsina Ala', 'Benue', 'Okpokpo', 'Adoka', 'Utonkon', 'Ikyeov', 'Tse Agbande', 'Yandev', 'Naka', 'Obi', 'Ogbotobo', 'Ushongo', 'Vandeikya'],
  'Borno': ['Maiduguri', 'Bama', 'Gwoza', 'Kukawa', 'Borno', 'Ngala', 'Dikwa', 'Mafa', 'Konduga', 'Kaga', 'Damboa', 'Chibok', 'Askira Uba', 'Kwaya Kusu', 'Mobille'],
  'Cross River': ['Calabar', 'Ikom', 'Obudu', 'Ogoja', 'Biase', 'Yakurr', 'Abi', 'Obubra', 'Boki', 'Etung', 'Akpabuyo', 'Bakassi', 'Calabar South', 'Odukpani', 'Akamkpa', 'Mbai'],
  'Delta': ['Asaba', 'Warri', 'Sapele', 'Abraka', 'Ughelli', 'Ozoro', 'Kwale', 'Okpe', 'Urhobos', 'Effrun', 'Patani', 'Burutu', 'Warri South', 'Warri North', 'Okwedaba', 'Isele'],
  'Ebonyi': ['Abakaliki', 'Afikpo', 'Onicha', ' Ivo', 'Ezza', 'Ikwo', 'Ishielu', 'Lu', 'Ohaukwu', 'Ebonyi', 'Izzi', 'Mwona', 'Ohaozara', 'Afikpo South', 'Obudua'],
  'Edo': ['Benin City', 'Ekpoma', 'Auchi', 'Irrua', 'Ughoton', 'Okada', 'Ewohimi', 'Igarra', 'Uromi', 'Afuze', 'Ozalla', 'Ibillo', 'Ikehua', 'Ologba', 'Ugu'],
  'Ekiti': ['Ado Ekiti', 'Ilejemeje', 'Ekiti East', 'Ekiti West', 'Ekiti South West', 'Ekiti West', 'Ise Orun', 'Oye', 'Ikole', 'Moba', 'Guje', 'Ilejeme', 'Idemo', 'Omu', 'Egot'],
  'Enugu': ['Enugu', 'Nsukka', 'Awgu', 'Aninri', 'Agbani', 'Oji River', 'Udi', 'Ezeagu', 'Igbo Etiti', 'Igboeze', 'Nkanu East', 'Nkanu West', 'Isi Uga', 'Akpugh', 'Umune', 'Nrobo'],
  'Gombe': ['Gombe', 'Funakaye', 'Yamaltu Deba', 'Balanga', 'Billiri', 'Kaltungo', 'Shongom', 'Yemaltu', 'Baroo', 'Kwami', 'Gombe', 'Tongo', 'Dukul', 'Malale', 'Haje Jela'],
  'Imo': ['Owerri', 'Okigwe', 'Orlu', 'Mbaise', 'Aboh Mbaise', 'Ngwa', 'Isiala Mbano', 'Njaba', 'Nkwerre', 'Obowo', 'Ohaji Egbema', 'Oguta', 'Ohaji', 'Orsu', 'Oru East', 'Oru West'],
  'Jigawa': ['Dutse', 'Kazaure', 'Birnin Kudu', 'Kiyawa', 'Gumel', 'Gagarawa', 'Jahun', 'Miga', 'Ringim', 'Taura', 'Auyakamma', 'Babura', 'Birniwa', 'Danbatta', 'Gwiwa'],
  'Kaduna': ['Kaduna', 'Zaria', 'Kafanchan', 'Kakangi', 'Kariya', 'Kubwa', 'Rigasa', 'Sabon Birni', 'Makera', 'Mando', 'Kamacha', 'Katsina', 'Kudan', 'Dan Ali', 'Danja'],
  'Kano': ['Kano', 'Wudil', 'Gwale', 'Kumbotso', 'Dala', 'Fagge', 'Gwarin', 'Tarauni', 'Gyadi', 'Kumbwaz', 'Dal Jal', 'Karaye', 'Rano', 'Bunkure', 'Gaya', 'Albasu'],
  'Kogi': ['Lokoja', 'Okene', 'Idah', 'Kabba', 'Koton Karfe', 'Ankpa', 'Okehi', 'Oloko', 'Ilorin', 'Ejule', 'Ajaokuta', 'Egbeda', 'Ibadan', 'Odoe', 'Isanlu', 'Owasha'],
  'Kwara': ['Ilorin', 'Offa', 'Jebba', 'Bode Saadu', 'Oyan', 'Ipee', 'Ere', 'Mbamm', 'Shonga', 'Patigi', 'Baruten', 'Kaiama', 'Keba', 'Kosubosu', 'Oke Ede', 'Igoshire'],
  'Lagos': ['Lagos Island', 'Surulere', 'Ikeja', 'Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Yaba', 'Mushin', 'Ikorodu', 'Ojo', 'Badagry', 'Epe', 'Ibeju Lekki', 'Amuwo Odofin', 'Oshodi Isolo'],
  'Nasarawa': [' Lafia', 'Keffi', 'Nasarawa', 'Nasarawa Egon', 'Wei', 'Kokona', 'Toto', 'Akwanga', 'Assakio', 'Izge', 'Udei', 'Laminga', 'Doma', 'R下方', 'Tudun Ghwamber'],
  'Niger': ['Minna', 'Bida', 'Suleja', 'Kontagora', 'Ibaji', 'Shiroro', 'Riyom', 'Paikoro', 'Wushishi', 'Mashegu', 'Borgu', 'Moyo', 'Kakuri', 'Nuciya', 'Guni'],
  'Ogun': ['Abeokuta', 'Ota', 'Ijebu Ode', 'Ikenne', 'Sagamu', 'Odogbolu', 'Yewa', 'Ewekoro', 'Remo North', 'Remo South', 'Iperu', 'Irolu', 'Osi', 'Saapade', 'Mowe'],
  'Ondo': ['Akure', 'Owo', 'Ondo', 'Oka Akoko', 'Ikare', 'Idanre', 'Ifon', 'Ose', 'Ile Oluji', 'Ondo West', 'Ondo East', 'Oke Aro', 'Iwade', 'Aromolara', 'Ilara', 'Otan Ayegbaju'],
  'Osun': ['Osogbo', 'Ilesa', 'Ife', 'Iwo', 'Ede', 'Ikirun', 'Ila Orangun', 'Ile Ife', 'Ilobu', 'Ikire', 'Inisa', 'Okukenu', 'Iyanfoworowo', 'Ishin', 'Olupoti'],
  'Oyo': ['Ibadan', 'Oyo', 'Iseyin', 'Ogbomoso', 'Saki', 'Kisi', 'Oke Ogun', 'Ibarapa', 'Orire', 'Kajola', 'Lagelu', 'Akinyele', 'Egbeda', 'Ona Ara', 'Ido', 'Apata'],
  'Plateau': ['Jos', 'Barkin Ladi', 'Pankshin', 'Kanam', 'Kanke', 'Shendam', 'Qua an Pan', 'Wase', 'Biu', 'Duru', 'Madara', 'Kigom', 'Kopek', 'Kombisa', 'R的正确', 'Langtang'],
  'Rivers': ['Port Harcourt', 'Obio Akpor', 'Okrika', 'Eleme', 'Etche', 'Oyigbo', 'Tai', 'Gokana', 'Khana', 'Opobo', 'Andoni', 'Nkoroo', 'Umune', 'Ihua', 'Chimito', 'Akul'],
  'Sokoto': ['Sokoto', 'Tambuwal', 'Wurno', 'Gada', 'Sokoto North', 'Sokoto South', 'Dange', 'Bodinga', 'Dandin', 'Kafin Madalla', 'Gwadabawa', 'Isah', 'Kware', 'Kalmalo', 'Kantora'],
  'Taraba': ['Jalingo', 'Bali', 'Gashaka', 'Sardauna', 'Kurfi', 'Fufio', 'Zing', 'Takum', 'Wukari', 'Yorro', 'Jibu', 'Saber', 'Muter', 'Kokoma', 'Karaye', 'Dusin'],
  'Yobe': ['Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Gaidam', 'Kumagba Yunusari', 'Yunusari', 'Bursari', 'Karasuwa', 'Machina', 'Ngala', 'Gudumbali', 'Kuku', 'Bara', 'Jakusko', 'Birni'],
  'Zamfara': ['Gusau', 'Kaura Namadi', 'Maru', 'Zaria', 'Talata Mafara', 'Anka', 'Bakura', 'Bukkuyum', 'Chafe', 'Tsafe', 'Zurmi', 'Gada', 'Shinkafe', 'Mayachichi', 'Kagar'],
  'Federal Capital Territory': ['Abuja', 'Kwali', 'Gwagwalada', 'Kuje', 'Bwari', 'Abaji', 'Maitama', 'Asokoro', 'Wuse', 'Gwarin', 'Kudi'],
}

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^0[0-9]{9,14}$/, 'Phone must start with 0 and be 10-15 digits'),
  address: z.string().min(5, 'Delivery address is required'),
  state: z.string().min(1, 'Please select a state'),
  city: z.string().min(1, 'Please select a city'),
  paymentMethod: z.enum(['bank_transfer', 'pay_on_delivery']),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const bankDetails = {
  bank: 'First Bank of Nigeria',
  account: '1234567890',
  accountName: 'KAY-FITS STORE',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getTotal, clearCart, user } = useCartStore()
  const [loading, setLoading] = useState(false)

  const defaultEmail = user?.email || ''

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'pay_on_delivery',
      email: defaultEmail,
      fullName: '',
      phone: '',
      address: '',
      state: '',
      city: '',
    },
  })

  const watchedState = watch('state')
  const paymentMethod = watch('paymentMethod')

  const cities = watchedState ? nigerianStates[watchedState] || [] : []

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      toast.error('Your bag is empty')
      return
    }

    setLoading(true)

    try {
      const orderId = Math.floor(Math.random() * 100000)

      try {
        await supabaseAdmin.from('orders').insert({
          user_id: user.id,
          order_number: orderId,
          customer_name: data.fullName,
          customer_email: data.email,
          customer_phone: data.phone,
          shipping_address: data.address,
          shipping_state: data.state,
          shipping_city: data.city,
          total: getTotal(),
          status: 'pending',
          payment_method: data.paymentMethod,
        })
      } catch (supabaseErr) {
        console.log('Supabase error:', supabaseErr)
      }

      clearCart()
      navigate('/order-success', { state: { orderId } })
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h1 className="font-display text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-500 mb-8">Please login to checkout.</p>
          <Link to="/login" className="bg-black text-white px-8 py-3 rounded-full font-medium">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <h1 className="font-display text-2xl font-bold mb-4">Your bag is empty</h1>
          <Link to="/shop" className="text-black underline">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    {...register('fullName')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone Number (must start with 0)</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="08012345678"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address</label>
                  <input
                    {...register('address')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="123 Street Name"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <select
                      {...register('state')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    >
                      <option value="">Select State</option>
                      {Object.keys(nigerianStates).sort().map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <select
                      {...register('city')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                      disabled={!watchedState}
                    >
                      <option value="">{watchedState ? 'Select City' : 'Select State first'}</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-black transition-colors">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="pay_on_delivery"
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Pay on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-black transition-colors">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="bank_transfer"
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Transfer to our bank account</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-white border rounded-lg">
                  <p className="font-medium mb-2">Bank Details:</p>
                  <p className="text-sm">Bank: {bankDetails.bank}</p>
                  <p className="text-sm">Account Number: {bankDetails.account}</p>
                  <p className="text-sm">Account Name: {bankDetails.accountName}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please transfer ₦{getTotal().toLocaleString()} and upload your receipt.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}