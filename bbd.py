
def return_sample_names():
    sample_names = Samples.__table__.columns
    sample_names_ls = [name.key for name in sample_names]
    sample_names_ls.remove("otu_id")
    return sample_names_ls

