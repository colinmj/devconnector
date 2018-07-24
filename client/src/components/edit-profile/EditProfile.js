import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import { withRouter, Link } from 'react-router-dom';
import isEmpty from '../../validation/isEmpty';

import { createProfile, getCurrentProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }

    if (nextProps.profile.profile) {
      const { profile } = nextProps.profile;
      // bring skills array back to comma separated string
      const skillsCSV = profile.skills.join(',');
      //if profile field doesn't exist, make empty string
      profile.company = !isEmpty(profile.company) ? profile.company : '';
      profile.location = !isEmpty(profile.location) ? profile.location : '';
      profile.website = !isEmpty(profile.website) ? profile.website : '';
      profile.githubusername = !isEmpty(profile.githubusername)
        ? profile.githubusername
        : '';
      profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter)
        ? profile.social.twitter
        : '';
      profile.facebook = !isEmpty(profile.social.facebook)
        ? profile.social.facebook
        : '';
      profile.linkedin = !isEmpty(profile.social.linkedin)
        ? profile.social.linkedin
        : '';
      profile.instagram = !isEmpty(profile.social.instagram)
        ? profile.social.instagram
        : '';
      profile.youtube = !isEmpty(profile.social.youtube)
        ? profile.social.youtube
        : '';

      // set the component state values
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        githubusername: profile.githubusername,
        bio: profile.bio,
        twitter: profile.twitter,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        youtube: profile.youtube,
        instagram: profile.instagram
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile Url"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Linkedin Profile Url"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="Facebook Profile Url"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Youtube Profile Url"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Instagram Profile Url"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }
    //select options for status
    const options = [
      {
        label: '*Select Professional status',
        value: 0
      },
      {
        label: 'Developer',
        value: 'Developer'
      },
      {
        label: 'Junior Developer',
        value: 'Junior Developer'
      },
      {
        label: 'Senior Developer',
        value: 'Senior Developer'
      },
      {
        label: 'Manager',
        value: 'Manager'
      },
      {
        label: 'Student',
        value: 'Student'
      },
      {
        label: 'Instructor',
        value: 'Instructor'
      },
      {
        label: 'Intern',
        value: 'Intern'
      },
      {
        label: 'Other',
        value: 'Other'
      }
    ];
    return (
      <div className="create-profile">
        <div className="container" />
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to="/dashboard" className="btn btn-light">
              Go Back
            </Link>
            <h1 className="display-4 text-center">Edit Profile</h1>

            <small className="d-block pb-3">* = required fields </small>

            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="*Profile Handle"
                name="handle"
                value={this.state.handle}
                onChange={this.onChange}
                error={errors.handle}
                info="A unique handle for your profile"
              />

              <SelectListGroup
                placeholder="status"
                name="status"
                value={this.state.status}
                onChange={this.onChange}
                error={errors.status}
                options={options}
                info="Give us an idea of where you are at in your career"
              />
              <TextFieldGroup
                placeholder="Company"
                name="company"
                value={this.state.company}
                onChange={this.onChange}
                error={errors.company}
                info="Could be your own or one you work for"
              />

              <TextFieldGroup
                placeholder="Location"
                name="location"
                value={this.state.location}
                onChange={this.onChange}
                error={errors.location}
                info="Where are you based?"
              />
              <TextFieldGroup
                placeholder="Website"
                name="website"
                value={this.state.website}
                onChange={this.onChange}
                error={errors.website}
                info="Could be your own website or the company you work for"
              />
              <TextFieldGroup
                placeholder="*Skills"
                name="skills"
                value={this.state.skills}
                onChange={this.onChange}
                error={errors.skills}
                info="Please comma separate your skills"
              />
              <TextFieldGroup
                placeholder="Github Username"
                name="githubusername"
                value={this.state.githubusername}
                onChange={this.onChange}
                error={errors.githubusername}
                info="Share your github!"
              />
              <TextAreaFieldGroup
                placeholder="Short Bio"
                name="bio"
                value={this.state.bio}
                onChange={this.onChange}
                error={errors.bio}
                info="Tell us about yourself!"
              />
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() =>
                    this.setState(prevState => ({
                      displaySocialInputs: !prevState.displaySocialInputs
                    }))
                  }
                  className="btn btn-light">
                  Add Social Links
                  <span className="text-muted">optional</span>
                </button>
              </div>
              {socialInputs}
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(CreateProfile));
