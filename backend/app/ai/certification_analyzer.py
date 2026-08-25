CERTIFICATIONS = {

    "Microsoft":[
        "microsoft",
        "azure",
        "az-900",
        "ai-900",
        "dp-900",
        "pl-300"
    ],

    "Google":[
        "google",
        "google cloud",
        "gcp",
        "associate cloud engineer",
        "professional cloud architect"
    ],

    "AWS":[
        "aws",
        "amazon web services",
        "cloud practitioner",
        "solutions architect"
    ],

    "Oracle":[
        "oracle",
        "oracle java",
        "oci"
    ],

    "Cisco":[
        "cisco",
        "ccna",
        "ccnp"
    ],

    "IBM":[
        "ibm",
        "ibm ai",
        "ibm data science"
    ],

    "UiPath":[
        "uipath",
        "rpa",
        "automation developer"
    ],

    "Coursera":[
        "coursera"
    ],

    "NPTEL":[
        "nptel"
    ],

    "Udemy":[
        "udemy"
    ]
}


def analyze_certifications(resume_text: str):

    resume = resume_text.lower()

    found = []

    feedback = []

    score = 100

    for provider, keywords in CERTIFICATIONS.items():

        for keyword in keywords:

            if keyword.lower() in resume:

                found.append(provider)

                break

    found = list(set(found))

    if len(found) == 0:

        score -= 50

        feedback.append(
            "No certifications detected."
        )

    elif len(found) == 1:

        score -= 20

        feedback.append(
            "Consider earning certifications from multiple platforms."
        )

    return {

        "certification_score": score,

        "certifications": found,

        "feedback": feedback
    }