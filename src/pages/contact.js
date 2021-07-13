import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

import { contactBody } from "./contact.module.css"

const Contact = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata.title
    return(
        <Layout location = {location} title={siteTitle}>
            <p className = {contactBody}> Send me an email at pumasemj@hotmail.com</p>
        </Layout>
    )
}

export default Contact

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`