const mailer = require("nodemailer");
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid");
const path = require("path");
const UserVerification = require("../models/userVerification");
const User = require("../models/user");

const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

const sendMail = ({_id, name, email}, res)=>{

    const uniqueString = uuidv4()+_id;
    const currentString = "http://localhost:5000/api/user/verification";

    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: "Verification d'email",
        html: `
            <div>
                <img src="cid:dataSience"/>            
            </div>
            <div>
                <h3>Data Sience Définition</h3>
                <p>Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems
                to extract knowledge and insights from noisy, structured and unstructured data,[1][2] and apply knowledge and
                actionable insights from data across a broad range of application domains. Data science is related to data mining,
                machine learning and big data. Data science is a "concept to unify statistics, data analysis, informatics, and their
                related methods" in order to "understand and analyze actual phenomena" with data.[3] It uses techniques and theories 
                drawn from many fields within the context of mathematics, statistics, computer science, information science, and domain 
                knowledge. However, data science is different from computer science and information science. Turing Award winner Jim 
                Gray imagined data science as a "fourth paradigm" of science (empirical, theoretical, computational, and now data-driven)
                 and asserted that "everything about science is changing because of the impact of information technology" and the data deluge</p>
            </div>
            <div>
                <h3>Relationship to statistics</h3>
                <p>Many statisticians, including Nate Silver, have argued that data science is not a new field, but rather another
                name for statistics.[13] Others argue that data science is distinct from statistics because it focuses on problems
                and techniques unique to digital data.[14] Vasant Dhar writes that statistics emphasizes quantitative data and
                description. In contrast, data science deals with quantitative and qualitative data (e.g. images) and emphasizes
                prediction and action.[15] Andrew Gelman of Columbia University has described statistics as a nonessential part
                of data science.[16] Stanford professor David Donoho writes that data science is not distinguished from statistics
                by the size of datasets or use of computing, and that many graduate programs misleadingly advertise their analytics
                and statistics training as the essence of a data science program. He describes data science as an applied field
                growing out of traditional statistics.[17] In summary, data science can be therefore described as an applied branch
                of statistics.</p>
            </div>
            <div>
                <a href="${currentString}/${_id}/${uniqueString}">Cliquer ici pour verifer le compte </a>
            </div>
        `,
        attachments:[{
            filename: "dataScience.jpg",
            path: path.join(process.cwd(), "images/dataScience.jpg"),
            cid: "dataSience"
        }]
    };

    const salt = bcrypt.genSaltSync(10);
    bcrypt.hash(uniqueString, salt)
        .then(uniqueHashedString =>{
            const userVerif = new UserVerification({
                userId: _id,
                uniqueString: uniqueHashedString,
                createdAt: Date.now(),
                expiredAt: Date.now() + 86400
            });
            userVerif.save()
                .then(() => {
                    transporter.sendMail(mailOptions);
                    return res.status(200).json({message: "Saved successfully Verify your email to confirm the account"})
                })
                .catch(error =>{
                    User.findByIdAndDelete({_id:_id});
                    return res.status(400).json({message:"Something went wrong please try again"});
                })
        })
};


module.exports = sendMail;

