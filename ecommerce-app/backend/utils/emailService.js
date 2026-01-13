const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOrderConfirmation = async (order, user) => {
    try {
        if (!user || !user.email) {
            console.log('No user email found for order confirmation');
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Order Confirmation #${order.id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Thank you for your order!</h1>
                    <p>Your order <strong>#${order.id}</strong> has been placed successfully.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Order Summary</h3>
                        <p><strong>Total Amount:</strong> $${parseFloat(order.total).toFixed(2)}</p>
                        <p><strong>Shipping Method:</strong> ${order.shippingMethod}</p>
                        <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    </div>

                    <p>You can track the status of your order by clicking the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track/${order.id}" 
                           style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Track Your Order
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        If you have any questions, please reply to this email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${user.email}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};
